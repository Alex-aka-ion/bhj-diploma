/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (element) {
            this.element = element;
            this.registerEvents();
        } else {
            throw Error('Empty element');
        }
    }

    /**
     * Необходимо запретить отправку формы. В момент отправки
     * вызывает метод submit()
     * */
    registerEvents() {
        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });
    }

    /**
     * Преобразует данные формы в объект вида
     * {
     *  'название поля формы 1': 'значение поля формы 1',
     *  'название поля формы 2': 'значение поля формы 2'
     * }
     * */
    getData() {
        const entries = (new FormData(this.element)).entries();

        let formFields = {};

        for (let item of entries) {
            formFields[item[0]] = item[1];
        }

        return formFields;
    }

    onSubmit(options) {

    }

    /**
     * Вызывает метод onSubmit и передаёт туда
     * данные, полученные из метода getData()
     * */
    submit() {
        this.onSubmit(this.getData());
    }
}
