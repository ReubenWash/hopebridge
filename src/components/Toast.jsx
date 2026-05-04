export default function Toast({ msg, error }) {
  return (
    <div className={`toast-msg${error ? ' error' : ''}`}>
      <i className={`fas ${error ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
      {msg}
    </div>
  )
}
