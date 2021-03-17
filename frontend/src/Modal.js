import { useRef } from "react";

function Modal({modalIsOpen, closeModal, children}) {
    const divContainer = useRef(null);
    const handleClick = e => {
        if (divContainer.current === e.target) {
            closeModal();
        }
    }

    return (
        <div ref={divContainer} className={`fixed z-10 inset-0 w-full h-full bg-gray-800 overflow-auto opacity-90 ${modalIsOpen ? "block" : "hidden"}`} onClick={handleClick}>
            <div className="bg-white p-4 mx-auto my-8 w-4/5 relative">
                <button className="absolute top-0 right-0 text-xl leading-10 cursor-pointer w-8 h-10 align-middle bg-red-500" onClick={closeModal}>x</button>
                {children}
            </div>
        </div>
    )
}

export default Modal;