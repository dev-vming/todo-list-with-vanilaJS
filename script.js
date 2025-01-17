// DOM 요소 생성 함수
function createElement({
  tagName,
  properties,
  parent,
  children,
  count = 1,
}) {
  const create = () => {
    const element = document.createElement(tagName);
    Object.assign(element, properties);
    parent?.appendChild(element);
    children?.map((child) => {
      child.parent = element;
      createElement(child);
    });
    return element;
  };

  if (count > 1) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(create());
    }
    return results;
  } else {
    return create();
  }
}

// DOM 요소 생성
const app = createElement({
  tagName: "div",
  properties: { id: "app" },
  parent: document.body,
});

const header = createElement({
  tagName: "div",
  properties: { id: "header" },
  parent: app,
  children: [
    {
      tagName: "h1",
      properties: { innerText: "TODO LIST" },
    },
    {
      tagName: "div",
      properties: { id: "counter" },
      children: [
        { tagName: "span", properties: { innerText: "total : " } },
        { tagName: "span", properties: { innerText: 0 } },
        {
          tagName: "span",
          properties: { innerText: "completed : " },
        },
        { tagName: "span", properties: { innerText: 0 } },
      ],
    },
  ],
});

const inputFeild = createElement({
  tagName: "div",
  properties: { id: "input-field" },
  parent: app,
  children: [
    {
      tagName: "input",
      properties: { placeholder: "할 일을 입력해주세요..." },
    },
    { tagName: "button", properties: { innerText: "add" } },
  ],
});

const itemListContainer = createElement({
  tagName: "div",
  properties: { id: "item-list-container" },
  parent: app,
  children: [
    {
      tagName: "ul",
      properties: { id: "item-list" },
    },
  ],
});

const itemList = document.querySelector("#item-list");

// 카운터 업데이트 함수
function updateCounter() {
  const counter = document.getElementById("counter");
  counter.children[1].innerText = itemList.children.length;
  const completeCount = Array.from(itemList.children).filter(
    (child) => child.firstChild.checked
  ).length;
  counter.lastChild.innerText = completeCount;
};

function registEvents(item) {
  const [checkbox, text, removeBtn] = item.children;

  // 체크박스 클릭 시 이벤트
  checkbox.addEventListener("change", () => {
    checkbox.checked
      ? (text.style.textDecoration = "line-through")
      : text.style.removeProperty("text-decoration");
    updateCounter();
  });

  // 삭제 버튼 클릭 시 이벤트
  removeBtn.addEventListener("click", () => {
    item.remove();
    updateCounter();
  });
};

// 입력된 할 일 검사
function validCheck(text){
  text = text.trim();
  if(text===''){
    alert('할 일이 입력되지 않았습니다!');
    return false;
  }

  if(Array.from(itemList.children).find((child) => child.children[1].innerText === text)){
    alert('이미 존재하는 할 일 입니다!');
    return false;
  }
  return true;
}

// add 버튼 클릭 시 이벤트
const addBtn = document.querySelector("#input-field button");

addBtn.addEventListener("click", () => {
  const text = addBtn.previousSibling.value;
  if(!validCheck(text)) return;
    registEvents(
      createElement({
      tagName: "li",
      parent: itemList,
      children: [
        {
          tagName: "input",
          properties: { type: "checkbox" },
        },
        {
          tagName: "span",
          properties: { innerText: addBtn.previousSibling.value },
        },
        {
          tagName: "button",
          properties: { innerText: "삭제" },
        },
      ],
    }));
    addBtn.previousSibling.value = null;
    updateCounter();
  });