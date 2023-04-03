const Notification = ({ notification }) => {

  if (notification.message === null) {
    return null
  }

  if(notification.type === 0) {
    return (
      <div className='notification'>
        {notification.message}
      </div>
    )}

  if (notification.type === 1){
    return (
      <div className='error'>
        {notification.message}
      </div>)
  }
}

export default Notification