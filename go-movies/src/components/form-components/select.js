export const Select = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">{" "}{props.title}{" "}</label>
      <select className="form-select" value={props.value} name={props.name} onChange={props.handleChange}>
        <option className="form-select" value="">{props.placeholder}</option>
        {props.options.map((option) => {
          return (
            <option className="form-select" key={option.id} value={option.id} label={option.value}>
              {option.value}
            </option>
          )
        })}
      </select>
    </div>
  )
}
