//Components/ChildViewer/ChildViewer.tsx
import { JSX } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { useChildViewer } from './useChildViewer';

export function ChildViewer({
  children,
  title,
  style,
  back
}: {
  back?: boolean,
  title?: string,
  children?: JSX.Element,
  style?: React.CSSProperties
}) {
  const { openChild } = useChildViewer();

  return (
    <div autoFocus className='child-viewer relative flex items-center justify-center h-full w-full'  onClick={(e) => (e.target == e.currentTarget) &&openChild(null)}>
      <div className="w-[95%] max-w-[750px] max-h-[80%] relative bg-white rounded-2xl overflow-y-auto overflow-x-hidden">
      <div className="w-full print:hidden sticky top-0 bg-white z-10 flex items-center px-3 py-1.5 shadow-sm">
        
        <h3 className="m-auto text-base font-medium">{title}</h3>
        <div className=" w-[25px] h-[25px] cursor-pointer transition-all duration-100 hover:scale-110 hover:bg-discret-9 rounded-full flex items-center justify-center">
          <IoCloseSharp
            className="w-full h-full"
            onClick={() => openChild(null)}
          />
        </div>
      </div>
      <div className="w-full h-full" style={style}>
        {children}
      </div>
    </div>
    </div>
  );
}
