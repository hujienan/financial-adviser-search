import { useRef } from "react";

function Modal({modalIsOpen, closeModal, children}) {
    const divContainer = useRef(null);
    const handleClick = e => {
        if (divContainer.current === e.target) {
            closeModal();
        }
    }

    return (
        <div ref={divContainer} className={`fixed z-10 inset-0 w-full h-full bg-gray-800 overflow-auto bg-opacity-95 text-left ${modalIsOpen ? "block" : "hidden"}`} onClick={handleClick}>
            <div className="bg-white mx-auto my-8 w-10/12 md:w-1/2 relative">
                <button className="absolute top-3 right-4 text-3xl cursor-pointer focus:outline-none text-white" onClick={closeModal}>x</button>
                {children}
            </div>
        </div>
    )
}

export default Modal;