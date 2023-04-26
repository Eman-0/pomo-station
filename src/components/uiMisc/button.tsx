const Button = ({title, onClickHandle} : {title: string, onClickHandle: () => void }) => {
    return(
        <>
            <button onClick={onClickHandle} className="bg-sky-500 hover:bg-sky-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white">{title}</button>
        </>
    )
}

export default Button;