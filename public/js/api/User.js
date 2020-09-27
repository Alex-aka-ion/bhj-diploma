/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user) );
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
    const options = {
      url: `${User.URL}/current`,
      method: 'GET',
      data: data,
      responseType: 'json',
      callback: (err, response) => {
        if (err === null) {
          if (response.success) {
            this.setCurrent(response.user);
          } else {
            this.unsetCurrent();
          }
        }
        return callback;
      }
    };

    return createRequest(options);
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {
    const options = {
      url: `${User.URL}/login`,
      method: 'POST',
      data: data,
      responseType: 'json',
      callback: (err, response) => {
        if (err === null) {
          if (response.success) {
            this.setCurrent(response.user);
          }
        }
        return callback(err,response);
      }
    };

    return createRequest(options);
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback = f => f ) {
    const options = {
      url: `${User.URL}/register`,
      method: 'POST',
      data: data,
      responseType: 'json',
      /*callback: callback*/
      callback: (err, response) => {
        if (err === null) {
          if (response.success) {
            this.setCurrent(response.user);
          }
        }
        return callback(err,response);
      }
    };

    return createRequest(options);
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {
    const options = {
      url: `${User.URL}/logout`,
      method: 'POST',
      data: data,
      responseType: 'json',
      callback: (err, response) => {
        if (err === null) {
          if (response.success) {
            this.unsetCurrent(response.user);
          }
        }
        return callback(err,response);
      }
    };

    return createRequest(options);
  }
}
