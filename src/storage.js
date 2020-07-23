export default class Storage {
  set userData(value){
    window.localStorage.setItem('userData', value ? JSON.stringify(value) : null)
  }

  get userData(){
    return JSON.parse(window.localStorage.getItem('userData'));
  }
}
