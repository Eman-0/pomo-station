const Button = ({title, onClickHandle} : {title: string, onClickHandle: () => void }) => {
    return(
        <>
            <button onClick={onClickHandle} className="button">{title}</button>
        </>
    )
}

export default Button;