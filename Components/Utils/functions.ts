//Components/Utils/functions.ts

export {
  ClientCall,
  getFileType,
  shortNumber,
  toNameString,
  debounce,
  getId,
  copyToClipboard,
  limit
}

function getId(id: string | undefined = '') {
  return '#' + id.substring(0, id.indexOf('-'))
}

const limit = (l?: string | undefined | null, m: number = 16) => {
  return ((l?.length || 0) > m ? l?.substring(0, m) + '..' : l) || ''
}

function ClientCall(fn: Function, defaultValue?: any, ...params: any[]) {
  if (typeof window !== 'undefined')
    try {
      return fn(...params);
    } catch (error) {
      return defaultValue
    }
  else
    return defaultValue
}

async function waitHere(millis: number) {
  await new Promise((rev) => setTimeout(() => rev(0), millis))
}


const CharList = Array.from({ length: 36 }).map((_, i) => Number(i).toString(36));
CharList.push('-');

function toNameString(name: string) {

  let n = name.toLocaleLowerCase();
  let _n = ''
  for (let i = 0; i < n.length; i++) {
    if (CharList.includes(n[i])) {
      _n += n[i];
    } else if (n[i] == ' ') {
      _n += '-'
    }
  }
  return _n
}
function getFileType(file: string | Blob | undefined) {
  if (typeof file == 'string') {
    const ext = file.substring(file.lastIndexOf('.') + 1, file.length);
    if (['webp', 'jpg', 'jpeg', 'png', 'avif', 'gif', 'tif', 'tiff', 'ico', 'svg'].includes(ext)) {
      return 'image';
    } else if (['webm', 'mp4', 'mov', 'avi', 'wmv', 'avchd', 'mkv', 'flv', 'mxf', 'mts', 'm2ts', '3gp', 'ogv'].includes(ext)) {
      return 'video';
    } else if (file.startsWith('data:image')) {
      return 'image'
    } else if (file.startsWith('data:video')) {
      return 'video'
    } else {
      return 'image'
    }
  } else {
    if (file?.type.split('/')[0] == 'image') {
      return 'image'
    } else if (file?.type.split('/')[0] == 'video') {
      return 'video'
    }
  }
  return
}


function shortNumber(n: number) {
  const n0 = Math.trunc(n).toString().length - 1 //nombre de 0 en entrer
  const index = Math.floor((n0) / 3); //index du array
  const r = n0 % 3; // nombre de  0 a afficher
  const result = n / Math.pow(10, n0 - r)
  return (Math.trunc(result * 100) / 100) + (['', 'K', 'M', 'B', 'T', 'Q'][index])
}



const MapCallId: Record<string, { out: number, isRuning: boolean, next: (() => void) | null }> = {}
function debounce(fn: () => void, id: string, out = 300) {
  MapCallId[id] = MapCallId[id] ?? {
    isRuning: false,
    next: null,
    out
  }

  if (MapCallId[id].isRuning) {
    MapCallId[id].next = fn
    MapCallId[id].out = out
  } else {
    MapCallId[id].isRuning = true;
    console.log('isRuning', true);

    fn()

    setTimeout(() => {
      MapCallId[id].isRuning = false;
      console.log('isRuning', false);
      MapCallId[id].next && debounce(MapCallId[id].next, id, MapCallId[id].out);
      MapCallId[id].next = null;
    }, out);
  }
}

async function copyToClipboard(text: string, onSuccess?: () => void, onError?: (err: Error) => void) {
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      throw new Error('Clipboard API not supported');
    }
    await navigator.clipboard.writeText(text);
    console.log('Texte copié dans le presse-papiers avec succès !');
    onSuccess?.();
  } catch (err) {
    console.error('Erreur lors de la copie dans le presse-papiers :', err);
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      console.log('Texte copié via la méthode de secours !');
      onSuccess?.();
    } catch (fallbackErr) {
      console.error('Échec de la méthode de secours :', fallbackErr);
      onError?.(fallbackErr as Error);
    }
  }
}