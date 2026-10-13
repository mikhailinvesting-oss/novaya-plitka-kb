// Единая структура базы знаний. Подключается на КАЖДОЙ странице.
// При добавлении нового документа — правим только этот файл.
// Категория может содержать либо "docs" напрямую, либо "folders"
// (массив папок, у каждой свой "docs") — тогда в сайдбаре появляется
// ещё один уровень вложенности.
var KB_STRUCTURE = [
  {
    cat: "С чего начать",
    docs: [
      { title: "С чего начать", url: "С чего начать.html", ready: true }
    ]
  },
  {
    cat: "О компании",
    docs: [
      { title: "О компании", url: "О компании.html", ready: true },
      { title: "Переадресация звонков", url: "Переадресация звонков.html", ready: true },
      { title: "Реквизиты компании", url: "Реквизиты компании.html", ready: true }
    ]
  },
  {
    cat: "Регламенты для сотрудников",
    docs: [
      { title: "От лида до закрытия сделки", url: "Бизнес-процессы.html", ready: true },
      { title: "Регламент менеджера по продажам", url: "Регламент менеджера по продажам.html", ready: true },
      { title: "Регламент логиста-оператора", url: "Регламент логиста-оператора.html", ready: true },
      { title: "Квалификация клиентов", url: "Квалификация клиентов.html", ready: true },
      { title: "Отработка возражений", url: "Отработка возражений.html", ready: true },
      { title: "Закрепление объектов", url: "Закрепление объектов.html", ready: true }
    ]
  },
  {
    cat: "Инструкции по продуктам и сервисам",
    docs: [
      { title: "Работа в 1С — заказы и клиенты", url: "Инструкции по 1С.html", ready: true },
      { title: "Касса в 1С", url: "Касса в 1С.html", ready: true },
      { title: "ЮКасса", url: "ЮКасса.html", ready: true },
      { title: "Bitrix24", url: "Bitrix24.html", ready: true }
    ]
  },
  {
    cat: "Обучение и тестирование",
    docs: [
      { title: "Обучение по продукту", url: "Обучение по продукту.html", ready: true },
      { title: "Конкуренты (конфиденциально)", url: "Конкуренты.html", ready: true },
      { title: "Аттестация по продукту", url: "Аттестация по продукту.html", ready: true }
    ]
  },
  {
    cat: "Документы",
    folders: [
      {
        name: "Каталоги",
        docs: [
          { title: "Каталог бамбуковых панелей BAIJAX 2026", url: "https://drive.google.com/file/d/1xsV1oOVO2U-X-qGvmaMqL8WIo-8NjLTD/view", ready: true, external: true },
          { title: "Каталог BAIJAX GZ Series 2026", url: "https://drive.google.com/file/d/1O_9KjievRr9Q8piKcG1zxJ6epbRIuk7J/view", ready: true, external: true },
          { title: "Каталог гибкого мрамора — готовые объекты", url: "https://drive.google.com/file/d/1OhfBqO1ufn7x5PYVkOqKlPa4UiampyNz/view", ready: true, external: true },
          { title: "Расцветки бамбуковых панелей — Color Card", url: "https://drive.google.com/file/d/1D_AgIVFpT7lQKh4HpKHfiJqKxWE90vfO/view", ready: true, external: true },
          { title: "Расцветки бамбуковых панелей — HD", url: "https://drive.google.com/file/d/1tzYxuLa6q_TSgXMF-xsU3fA_RVMvHL56/view", ready: true, external: true }
        ]
      },
      {
        name: "Прайсы",
        docs: [
          { title: "Прайс — стеновые панели BAIJAX", url: "https://drive.google.com/file/d/1chMvp-81mHwOXiqY9TSidWOfuBcSpPi6/view", ready: true, external: true },
          { title: "Прайс — рейки BAIJAX", url: "https://drive.google.com/file/d/194Qc2L2gyVRmwcYAGYDYGdzSihbwVBE9/view", ready: true, external: true },
          { title: "Прайс — алюминиевые профили BAIJAX", url: "https://drive.google.com/file/d/137_Gg6kWrwpdjj23R-LY2q-geexZktuD/view", ready: true, external: true },
          { title: "Прайс — двери скрытого монтажа BAIJAX", url: "https://drive.google.com/file/d/11fTawdgHkw8zfde3wuN1OXDPLcEGFRWj/view", ready: true, external: true },
          { title: "Прайс — Hidden Doors, Тюмень", url: "https://drive.google.com/file/d/1feIaYtUrTNHfkCpHPkWr1cupQ8IyYqw2/view", ready: true, external: true }
        ]
      },
      {
        name: "Договоры и рабочие бланки",
        docs: [
          { title: "Договор поставки — физ. лицо, тротуарная плитка", url: "https://drive.google.com/file/d/1D3i9dTKfQi4yD27qZBBz7Z9a0lKntaWP/view", ready: true, external: true },
          { title: "Договор поставки — физ. лицо, товары интерьера", url: "https://drive.google.com/file/d/1GC6zLUcY0DrZAGm9p6PRus7j9zaz1lbB/view", ready: true, external: true },
          { title: "Договор поставки — юр. лицо, тротуарная плитка", url: "https://drive.google.com/file/d/1vN6GzAGPRnQr72XfQR4V5b_bESWo9v5U/view", ready: true, external: true },
          { title: "Договор поставки — юр. лицо, товары интерьера", url: "https://drive.google.com/file/d/1m34m1abu54Aa6DBTuauEK2C3SyEXkfvx/view", ready: true, external: true },
          { title: "Агентский договор", url: "https://drive.google.com/file/d/18Nnjw01bEZzw8O6Et8aDyGSdKISJ4L8v/view", ready: true, external: true },
          { title: "Спецификация к договору", url: "https://drive.google.com/file/d/1PvzvaaIQwM8qt7jyYCjO97qql6Srf6wg/view", ready: true, external: true },
          { title: "Коммерческое предложение — образец", url: "https://drive.google.com/file/d/1hzCgtQFkVMHW1MlWaY6n7LmOVn6Q4I0p/view", ready: true, external: true },
          { title: "Счёт на оплату — образец", url: "https://drive.google.com/file/d/1cK9FuqoY4KqfDrUWCtSgdYGTXpkCBSPW/view", ready: true, external: true },
          { title: "Товарная накладная — образец", url: "https://drive.google.com/file/d/1iOsXfe98n5azX2sx88y9ZtGLsUp92AzM/view", ready: true, external: true },
          { title: "Заказ клиента — образец из 1С", url: "https://drive.google.com/file/d/1rnjydK84k1vgkYZ5dnSoBh5CrERWY3pS/view", ready: true, external: true }
        ]
      },
      {
        name: "Партнёры",
        docs: [
          { title: "Условия для дилеров и дизайнеров", url: "Условия для дилеров и дизайнеров.html", ready: true }
        ]
      },
      {
        name: "Сертификаты",
        docs: [
          { title: "Сертификаты на продукцию", url: "Сертификаты.html", ready: true }
        ]
      }
    ]
  },
  {
    cat: "Новости",
    docs: [
      { title: "Лента новостей", url: null, ready: false }
    ]
  }
];
