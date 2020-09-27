/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw Error('empty element');
    } else {
      this.element = element;
      this.registerEvents();
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.getElementsByClassName('remove-account')[0];
    removeAccount.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });

    const content = document.getElementsByClassName('content')[0];
    content.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('transaction__remove')) {
        this.removeTransaction(e.target.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove(this.lastOptions.account_id, {}, (err, response) => {
          if (err === null) {
            if (response.success) {
              this.clear();
              App.update();
            } else {
              alert(JSON.stringify(response.error));
            }
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id, {}, (err, response) => {
        if (err === null) {
          if (response.success) {
            App.update();
          } else {
            alert(JSON.stringify(response.error));
          }
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if (options) {
      this.lastOptions = options;
      Account.get( options.account_id, options, (err,response) => {
        if (err === null) {
          if (response.success) {
            this.renderTitle(response.data.name);
            Transaction.list( options, (err, response) => {
              if (err === null) {
                if (response.success) {
                  this.renderTransactions(response.data);
                } else {
                  alert(JSON.stringify(response.error));
                }
              }
            })
          } else {
            alert(JSON.stringify(response.error));
          }
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = undefined;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
    document.getElementsByClassName('content-title')[0].innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} г. в ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( item ) {
    return `<!-- либо transaction_expense, либо transaction_income -->
            <div class="transaction transaction_${item.type.toLowerCase()} row">
                <div class="col-md-7 transaction__details">
                  <div class="transaction__icon">
                      <span class="fa fa-money fa-2x"></span>
                  </div>
                  <div class="transaction__info">
                      <h4 class="transaction__title">${item.name}</h4>
                      <!-- дата -->
                      <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="transaction__summ">
                  <!--  сумма -->
                      ${item.sum}<span class="currency">₽</span>
                  </div>
                </div>
                <div class="col-md-2 transaction__controls">
                    <!-- в data-id нужно поместить id -->
                    <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                        <i class="fa fa-trash"></i>  
                    </button>
                </div>
            </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    const content = document.getElementsByClassName('content')[0];
    content.innerText = '';
    data.forEach((trans) => {
      content.insertAdjacentHTML('beforeend',this.getTransactionHTML(trans));
    })
  }
}
