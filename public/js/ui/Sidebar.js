/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const button = document.getElementsByClassName('sidebar-toggle')[0];

    button.addEventListener('click', function (e) {
      e.preventDefault();

      document.getElementsByTagName('body')[0].classList.toggle('sidebar-open');
      document.getElementsByTagName('body')[0].classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const modalRegister = App.getModal('register');
    const register = document.getElementsByClassName('menu-item_register')[0];

    register.addEventListener('click', (e) => {
      e.preventDefault();
      modalRegister.open();
    })

    const modalLogin = App.getModal('login');
    const login = document.getElementsByClassName('menu-item_login')[0];

    login.addEventListener('click', (e) => {
      e.preventDefault();
      modalLogin.open();
    })

    const logout = document.getElementsByClassName('menu-item_logout')[0];

    logout.addEventListener('click', (e) => {
      e.preventDefault();
      User.logout({}, (err, response) => {
        if (response.success) {
          App.setState('init');
        }
      });
    })

  }

}
