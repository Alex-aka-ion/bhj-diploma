/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm{
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({} , (err,response) => {
      if (err === null) {
        if (response.success) {
          const incomeAcctList = document.getElementById('income-accounts-list');
          incomeAcctList.querySelectorAll('option').forEach((account) => {
            account.remove();
          });
          const expenseAcctList = document.getElementById('expense-accounts-list');
          expenseAcctList.querySelectorAll('option').forEach((account) => {
            account.remove();
          });
          response.data.forEach((account) => {
            expenseAcctList.insertAdjacentHTML('beforeend', `<option value="${account.id}">${account.name}</option>`)
            incomeAcctList.insertAdjacentHTML('beforeend', `<option value="${account.id}">${account.name}</option>`)
          });
        } else {
          alert(JSON.stringify(response.error));
        }
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    Transaction.create(options, (err,response) => {
      if (err === null) {
        if (response.success) {
          App.getModal('newIncome').close();
          App.getModal('newExpense').close();
          this.element.reset();
          App.update();
        } else {
          alert(JSON.stringify(response.error));
        }
      }
    })
  }
}
