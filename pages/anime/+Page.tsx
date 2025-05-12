import React, {
    forwardRef,
    useImperativeHandle,
    useState,
    useRef,
    useEffect,
    ReactElement,
    CSSProperties,
} from "react";
import { motion, AnimatePresence, Variants, AnimationDefinition, useAnimation } from "framer-motion";
import { getImg } from "../../Components/Utils/StringFormater";
import { useWindowSize } from "../../Hooks/useWindowSize";
import { ProductPhone } from "../../Components/Animation/ProductPhone";

// ----- Types & Interfaces -----
export interface ViewInterface {
    element: ReactElement;
    x: number; // [0,1] horizontal position within card
    y: number; // [0,1] vertical position within card
    z: number; // [-1,1] profondeur
    anime?: AnimationDefinition
}

export interface CardProps {
    views: ViewInterface[];
    duration: number; // ms display duration before auto-switch
    z: number; // [0,1] depth factor for radius
    style?: CSSProperties; // optional custom style
}

export interface CardRotatatorHandle {
    addCard(card: CardProps): void;
    next(): void;
    prev(): void;
    showAt(index: number): void;
}

// ----- Animation Variants -----
const transitionDuration = 500; // Transition time in ms

const variants: Variants = {
    enter: (dir: number) => ({
        rotateY: dir > 0 ? 180 : -180,
        opacity: 0,
        transformPerspective: 10000, // Maintient la perspective pendant l'animation
    }),
    center: {
        rotateY: 0,
        opacity: 1,
        transformPerspective: 10000,
    },
    exit: (dir: number) => ({
        rotateY: dir > 0 ? -180 : 180,
        opacity: 0,
        transformPerspective: 10000,
    }),
};


const View = ({ v }: { v: ViewInterface }) => {
    const controls = useAnimation();

    useEffect(() => {
        if (v.anime) {
            controls.start(v.anime);
        } else {
            controls.start({ x: 0, y: 0 });
        }
    }, [controls, v]);

    return <motion.div
        animate={controls}
        className="overflow-visible"
        style={{
            position: "absolute",
            left: `${v.x * 100}%`,
            top: `${v.y * 100}%`,
            translateZ: `${v.z * 100}px`,
            transformStyle: "preserve-3d",
        }}
    >
        {v.element}
    </motion.div>
}


// ----- CardRotatator Component -----
export const CardRotatator = forwardRef<
    CardRotatatorHandle,
    { initialIndex?: number; containerStyle?: CSSProperties }
>(({ initialIndex = 0, containerStyle }, ref) => {
    const [cards, setCards] = useState<CardProps[]>([]);
    const [index, setIndex] = useState(2);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState(1);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Expose methods
    useImperativeHandle(ref, () => ({
        addCard(card: CardProps) {
            setCards((c) => [...c, card]);
        },
        next() {
            changeIndex(index + 1);
        },
        prev() {
            changeIndex(index - 1);
        },
        showAt(i: number) {
            changeIndex(i);
        },
    }));

    // Auto-switch based on card's duration
    useEffect(() => {
        clearTimer();
        if (!cards[index]) return;
        timerRef.current = setTimeout(() => {
            changeIndex(index + 1);
        }, cards[index].duration);
        return clearTimer;
    }, [index, cards]);

    function clearTimer() {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }

    function changeIndex(newIndex: number) {
        if (cards.length === 0) return;
        const wrapped = (newIndex + cards.length) % cards.length;
        const dir = newIndex > index ? 1 : -1;
        setDirection(dir);
        setPrevIndex(index);
        setIndex(wrapped);
    }

    const containerDefault: CSSProperties = {
        position: "relative",
        perspective: "1000px", // Perspective sur le conteneur parent
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d", // Maintient l'espace 3D
        ...containerStyle,
    };

    const cardWrapper: CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const defaultCardStyle: CSSProperties = {
        // background: "#fff",
        borderRadius: 12,
        // boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        width: "80%",
        height: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        transformStyle: "preserve-3d",
    };

    return (
        <div style={containerDefault}>
            <AnimatePresence custom={direction} initial={false}>
                {prevIndex !== null && (
                    <motion.div
                        key={`card-${prevIndex}`}
                        custom={direction}
                        variants={variants}
                        initial="center"
                        animate="exit"
                        exit="exit"
                        className="overflow-visible"
                        transition={{ duration: transitionDuration / 1000 }}
                        style={{
                            ...cardWrapper,
                            transformOrigin: `50% 50% -${cards[prevIndex].z * 300}px`,
                        }}
                    >
                        <div
                            className="overflow-visible"
                            style={{
                                ...defaultCardStyle,
                                // ...cards[prevIndex].style,
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            {cards[prevIndex].views.sort((a, b) => a.z - b.z).map((v, i) => (
                                <View key={i} v={v} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {cards[index] && (
                    <motion.div
                        key={`card-${index}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="overflow-visible"
                        transition={{ duration: transitionDuration / 1000 }}
                        style={{
                            ...cardWrapper,
                            transformOrigin: `50% 50% -${cards[index].z * 300}px`,
                        }}
                    >
                        <div
                            className="overflow-visible"
                            style={{
                                ...defaultCardStyle,
                                // ...cards[index].style,
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            {cards[index].views.sort((a, b) => a.z - b.z).map((v, i) => (

                                <View key={i} v={v} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

// ----- Page Component -----
export { Page as AnimationCard }
export function Page({ parentRef, factor = 1 }: { factor?: number, parentRef: { current: HTMLDivElement | null } }) {
    const rotatorRef = useRef<CardRotatatorHandle>(null);
    const [s, setS] = useState(1);

    const size = useWindowSize()

    useEffect(() => {
        const p = parentRef.current;
        if (!p) return;
        const w = p.getBoundingClientRect().width
        const _s = (w) / 520
        setS(_s)
    }, [size, parentRef])
    useEffect(() => {
        if (!rotatorRef.current) return;
        

        const cards: CardProps[] = [
            // ----- CARTE 1: Livraison Dynamique -----
            {
                views: [
                    { // Le camion: Mouvement principal, un peu plus prononcé
                        element: <div style={{ width: `${s * 345 * 0.7}px`, height: `${s * 345 * 0.7}px`, background: getImg("/res/view_delivery/car.png") }} />,
                        x: 0.5, y: 0.3, z: 0.1, // Légèrement en avant pour être au-dessus des colis proches
                        anime: {
                            scale: [1, 1.03, 1],
                            y: [0, -8, 0], // Léger flottement vertical
                            x: [0, 5, -5, 0], // Balancement horizontal subtil
                            rotateY: [0, 2, -2, 0], // Petite rotation
                            transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatType: "reverse" },
                        }
                    },
                    { // Colis 1: Flottement doux, décalé
                        element: <div style={{ width: `${s * 256 * 0.2}px`, height: `${s * 256 * 0.2}px`, background: getImg("/res/view_delivery/pack1.png") }} />,
                        x: 0.38, y: 0.65, z: 0.2, // Plus en avant
                        anime: {
                            scale: [1, 1.1, 1],
                            y: [0, 5, 0],
                            rotateZ: [0, -3, 3, 0],
                            transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3, repeatType: "reverse" },
                        }
                    },
                    { // Colis 2: Animation de rotation plus rapide, petit
                        element: <div style={{ width: `${s * 256 * 0.18}px`, height: `${s * 259 * 0.18}px`, background: getImg("/res/view_delivery/pack2.png") }} />,
                        x: 0.55, y: 0.7, z: 0.25, // Le plus en avant
                        anime: {
                            scale: [1, 1.08, 1],
                            rotateY: [0, 25, -25, 0],
                            x: [0, 3, 0],
                            transition: { duration: 4, repeat: Infinity, ease: 'linear', delay: 0.7 },
                        }
                    },
                    { // Colis 3: Mouvement latéral plus ample, en arrière-plan des autres colis
                        element: <div style={{ width: `${s * 256 * 0.35}px`, height: `${s * 229 * 0.35}px`, background: getImg("/res/view_delivery/pack3.png") }} />,
                        x: 0.15, y: 0.75, z: 0.05, // Un peu en retrait
                        anime: {
                            x: [0, 15, -10, 0],
                            y: [0, -5, 0],
                            scale: [1, 0.95, 1.05, 1],
                            transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1, repeatType: "reverse" },
                        }
                    },
                    { // Le mobile en fond: Statique ou animation très subtile
                        element: <div style={{ width: `${s * 426 * 0.75}px`, height: `${s * 585 * 0.75}px`, background: getImg("/res/view_delivery/mobile.png", "contain") }} />,
                        x: 0.3, // Centré x
                        y: 0.0, // Centré y pour que le haut du téléphone soit visible
                        z: -0.5, // En arrière-plan
                        // Pas d'animation ou une animation de fond très lente si désiré
                        // anime: {
                        //     opacity: [0.95, 1, 0.95],
                        //     transition: { duration: 10, repeat: Infinity, ease: 'linear' }
                        // }
                    },
                ],
                duration: 6000, // Augmenter la durée pour apprécier les animations décalées
                z: 0.8, // Ajuster la profondeur de la carte si besoin
            },
            // ----- CARTE 2: Options de Paiement Flottantes -----
            {
                views: [
                    { // Moov: Apparition/disparition en douceur, flottement diagonal
                        element: <div className="rounded-[25px] overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: `${s * 300 * 0.22}px`, height: `${s * 300 * 0.22}px`, background: getImg("/res/view_payment/moov.png") }} />,
                        x: 0.2, y: 0.1, z: 0.2,
                        anime: {
                            opacity: [0.7, 1, 1, 0.7],
                            scale: [0.9, 1.05, 1.05, 0.9],
                            x: [0, 5, -3, 0],
                            y: [0, -5, 3, 0],
                            transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2, repeatType: "reverse" },
                        }
                    },
                    { // MTN: Mouvement de "respiration" et léger pivot
                        element: <div className="rounded-md overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: `${s * 500 * 0.22}px`, height: `${s * 310 * 0.22}px`, background: getImg("/res/view_payment/mtn.png") }} />,
                        x: 0.75, y: 0.25, z: 0.1,
                        anime: {
                            scale: [1, 1.08, 1, 1.08, 1],
                            rotateY: [0, 5, 0, -5, 0],
                            transition: { duration: 3.8, repeat: Infinity, ease: 'circOut', delay: 0.5 },
                        }
                    },
                    { // Visa: Balancement lent
                        element: <div className="rounded-md overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: `${s * 433 * 0.23}px`, height: `${s * 325 * 0.23}px`, background: getImg("/res/view_payment/visa.jpg") }} />,
                        x: 0.15, y: 0.6, z: 0.3, // Plus en avant
                        anime: {
                            rotateZ: [-4, 4, -4],
                            y: [0, 6, 0],
                            transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0, repeatType: "reverse" },
                        }
                    },
                    { // Wave: Sautillement
                        element: <div className="rounded-md overflow-hidden" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: `${s * 480 * 0.21}px`, height: `${s * 270 * 0.21}px`, background: getImg("/res/view_payment/wave.png") }} />,
                        x: 0.8, y: 0.75, z: 0.15,
                        anime: {
                            y: [0, -12, 0, -8, 0], // Sauts de différentes hauteurs
                            scaleY: [1, 0.9, 1.05, 0.95, 1], // Effet squash & stretch
                            transition: { duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 },
                        }
                    },
                    { // Téléphone en fond: Statique
                        element: <div style={{ width: `${s * 346 * 0.55}px`, height: `${s * 722 * 0.55}px`, background: getImg("/res/view_payment/phone.png", "contain") }} />,
                        x: 0.35, y: 0, z: -0.5,
                    },
                ],
                duration: 5500,
                z: 1,
            },
            // ----- CARTE 3: Vitrine de Produits -----
            {
                views: [
                    { // Le téléphone (ProductPhone): Peut-être une rotation lente ou un effet de "scan"
                        element: <ProductPhone />, // Votre composant existant
                        x: 0.5, y: 0.0, z: -0.1, // Légèrement en arrière pour que les produits passent devant
                        anime: {
                            rotateY: [0, 5, 0, -5, 0], // Rotation lente
                            // Ou un effet de "lueur" si ProductPhone le gère
                            transition: { duration: 8, repeat: Infinity, ease: 'linear', delay: 1 },
                        }
                    },
                    { // Casque: Orbite autour d'un point
                        element: <div style={{ width: `${s * 256 * 0.5}px`, height: `${s * 256 * 0.5}px`, background: getImg("/res/view_product/casque.png", "contain") }} />,
                        x: 0.2, y: 0.3, z: 0.4,
                        anime: {
                            // Pour un effet d'orbite, on anime x et y de manière sinusoïdale déphasée
                            // C'est plus complexe à faire avec les keyframes simples.
                            // Une alternative est une rotation du parent (non fait ici pour garder simple)
                            // ou un mouvement plus simple :
                            x: [0, 20, 0, -20, 0],
                            y: [0, -15, 0, 15, 0],
                            rotateZ: [0, 360], // Rotation complète sur Z
                            scale: [1, 1.1, 1, 0.9, 1],
                            transition: { duration: 6, repeat: Infinity, ease: 'linear', delay: 0 },
                        }
                    },
                    { // Chaise: Mouvement de balancier
                        element: <div style={{ width: `${s * 256 * 0.35}px`, height: `${s * 256 * 0.35}px`, background: getImg("/res/view_product/chaise.png", "contain") }} />,
                        x: 0.8, y: 0.7, z: 0.3,
                        anime: {
                            rotateZ: [-8, 8, -8],
                            x: [0, 5, 0],
                            transition: { duration: 3.3, repeat: Infinity, ease: 'easeInOut', delay: 0.4, repeatType: "reverse" },
                        }
                    },
                    { // Habit: Flottement avec changement d'échelle
                        element: <div style={{ width: `${s * 256 * 0.4}px`, height: `${s * 256 * 0.4}px`, background: getImg("/res/view_product/habit.png", "contain") }} />,
                        x: 0.75, y: 0.2, z: 0.2,
                        anime: {
                            y: [0, -10, 5, 0],
                            scale: [1, 1.07, 0.93, 1],
                            opacity: [1, 0.8, 1],
                            transition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 },
                        }
                    },
                    { // Charette: Apparition et disparition en "pop"
                        element: <div style={{ width: `${s * 256 * 0.3}px`, height: `${s * 256 * 0.3}px`, background: getImg("/res/view_product/charette.png", "contain") }} />,
                        x: 0.25, y: 0.8, z: 0.1,
                        anime: {
                            scale: [0, 1.1, 0.9, 1, 1, 0], // Pop in, reste, pop out
                            opacity: [0, 1, 1, 1, 1, 0],
                            rotate: [0, 0, 0, 0, 15, 0], // Petite rotation en disparaissant
                            transition: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: 1.5,
                                // times: [0, 0.2, 0.3, 0.4, 0.8, 1] // Pour contrôler le timing de chaque keyframe
                            },
                        }
                    },
                    { // Charette: Apparition et disparition en "pop"
                        element: <div style={{ width: `${s * 256 * 0.3}px`, height: `${s * 256 * 0.3}px`, background: getImg("/res/view_product/pack1.png", "contain") }} />,
                        x: 0.25, y: 0.8, z: 0.1,
                        anime: {
                            scale: [0, 1.1, 0.9, 1, 1, 0], // Pop in, reste, pop out
                            opacity: [0, 1, 1, 1, 1, 0],
                            rotate: [0, 0, 0, 0, 15, 0], // Petite rotation en disparaissant
                            transition: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: 1.5,
                                // times: [0, 0.2, 0.3, 0.4, 0.8, 1] // Pour contrôler le timing de chaque keyframe
                            },
                        }
                    },
                ],
                duration: 7000, // Plus de temps pour observer la scène
                z: 1.1,
            },
        ];
        cards.forEach((c) => rotatorRef.current!.addCard(c));
    }, []);

    return (
        <div style={{ width: 500, height: 350, margin: "50px auto", position: "relative", scale: s * factor }}>
            <CardRotatator ref={rotatorRef} initialIndex={0} />
            {/* <div
                style={{
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 16,
                }}
            >
                <button
                    onClick={() => rotatorRef.current?.prev()}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        background: "#007bff",
                        color: "#fff",
                    }}
                >
                    Prev
                </button>
                <button
                    onClick={() => rotatorRef.current?.next()}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        background: "#28a745",
                        color: "#fff",
                    }}
                >
                    Next
                </button>
            </div> */}
        </div>
    );
}