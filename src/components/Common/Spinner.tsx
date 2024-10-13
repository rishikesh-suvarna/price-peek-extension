const Spinner = ({ classnames }: { classnames: string }) => {
  return (
    <div className={`flex justify-center items-center ${classnames}`}>
        <div className="spinner"></div>
    </div>
  )
}

export default Spinner