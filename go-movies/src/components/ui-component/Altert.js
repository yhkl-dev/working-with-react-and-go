export const Alert = (props) => {
  return (
    <div className={`alert ${props.alertType}`} role="alert">
      {props.alertMessage}
    </div>
  );
}