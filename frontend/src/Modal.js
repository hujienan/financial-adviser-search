function Modal({modalIsOpen, closeModal, hits}) {

    return (
        <div className={`fixed z-10 inset-0 w-full h-full bg-gray-500 overflow-auto opacity-90 ${modalIsOpen ? "block" : "hidden"}`} onClick={(e) => closeModal()}>
            <div className="bg-white p-4 mx-auto my-8">
                {hits && (hits.length > 0)  && hits[0]._source.name}
            </div>
        </div>
    )
}

export default Modal;