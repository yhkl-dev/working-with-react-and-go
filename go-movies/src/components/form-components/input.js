export const Input = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">{props.title}</label>
      <input type={props.type} className={`form-control ${props.className}`} id={props.name} name={props.name} value={props.value} onChange={props.handleChange} placeholder={props.placeholder}>
      </input>
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  )
}


export const TextInput = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">{props.title}</label>
      <textarea rows={props.rows} className="form-control" id={props.name} name={props.name} value={props.value} onChange={props.handleChange} placeholder={props.placeholder} />
    </div >
  )
}
