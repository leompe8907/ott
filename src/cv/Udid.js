function GetUdid() {
    let result = '';
    const persistedUDID = localStorage.getItem('udid');
    if (persistedUDID) {
      result = persistedUDID;
    } else {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      localStorage.setItem('udid', result);
    }
    return result;
  }
export default GetUdid