const menuItems = [
    {
        name: 'French Fries with Ketchup',
        price: 2.23,
        image: 'plate__french-fries.png',
        alt: 'French Fries',
        count: 0
    },
    {
        name: 'Salmon and Vegetables',
        price: 5.12,
        image: 'plate__salmon-vegetables.png',
        alt: 'Salmon and Vegetables',
        count: 0
    },
    {
        name: 'Spaghetti Meat Sauce',
        price: 7.82,
        image: 'plate__spaghetti-meat-sauce.png',
        alt: 'Spaghetti with Meat Sauce',
        count: 0
    },
    {
        name: 'Bacon, Eggs, and Toast',
        price: 5.99,
        image: 'plate__bacon-eggs.png',
        alt: 'Bacon, Eggs, and Toast',
        count: 0
    },
    {
        name: 'Chicken Salad with Parmesan',
        price: 6.98,
        image: 'plate__chicken-salad.png',
        alt: 'Chicken Salad with Parmesan',
        count: 0
    },
    {
        name: 'Fish Sticks and Fries',
        price: 6.34,
        image: 'plate__fish-sticks-fries.png',
        alt: 'Fish Sticks and Fries',
        count: 0
    }
]
let subtotal = 0;
let tax = 0;
const addButtons = document.querySelectorAll('.add');
const cartSummary = document.querySelector('.cart-summary');
const emptyText = document.querySelector('.empty');


function isCartEmpty(){
    const cartElements = document.querySelectorAll('.cart-summary li');
    if(cartElements.length === 0){
        emptyText.style.display = 'block';
    } else {
        emptyText.style.display = 'none';
    }
}

function countSubtotal(price){
    price = parseFloat(price);
    subtotal = parseFloat(subtotal + price);
    subtotal = parseFloat(subtotal.toFixed(2));
}
function countTax(){
    tax = subtotal*0.0975;
    tax = parseFloat(tax.toFixed(2));
}

function countPlatePrice(menuId){
    let price = menuItems[menuId].price * menuItems[menuId].count;
    price = price.toFixed(2);
    return price;
}

function writeSubtotal(price){
    countSubtotal(price);
    countTax();
    const total = (subtotal+tax).toFixed(2);

    document.querySelector('.totals .subtotal').innerHTML = '$' + subtotal;
    document.querySelector('.totals .tax').innerHTML = '$' + tax;
    document.querySelector('.totals .total .total').innerHTML = '$' + total;
}

function createPlate(menuId){
    const plate = document.createElement('div');
    plate.classList.add('plate');

    const plateImg = Object.assign(
        document.createElement('img'),
        {
            src: `images/${menuItems[menuId].image}`,
            alt: menuItems[menuId].name,
            className: 'plate'
        }
    )
    const quantityDiv = Object.assign(
        document.createElement('div'),
        {
            className: 'quantity',
            innerText: menuItems[menuId].count
        }
    )
    plate.append(plateImg, quantityDiv)

    return plate;
}
function createContent(menuId){
    const content = document.createElement('div');
    content.classList.add('content')

    const menuItem = Object.assign(
        document.createElement('p'),
        {
            className: 'menu-item',
            innerText: menuItems[menuId].name
        }
    )
    const price = Object.assign(
        document.createElement('p'),
        {
            className: 'price',
            innerText: '$' + (menuItems[menuId].price).toFixed(2)
        }
    )

    content.append(menuItem, price)

    return content;
}
function createQuantityWrapper(menuId){
    const quantityWrapper = document.createElement('div');
    quantityWrapper.classList.add('quantity__wrapper');

    const decrease = document.createElement('button');
    decrease.classList.add('decrease', 'change-amount');
    decrease.setAttribute('data-change-direction', '-1');

    const arrowReduce = Object.assign(
        document.createElement('img'),
        {
            src: 'images/chevron.svg',
            alt: 'amount reduce',
            title: 'amount reduce'
        }
    )
    decrease.append(arrowReduce)

    const div = Object.assign(
        document.createElement('div'),
        {
            className: 'quantity',
            innerText: menuItems[menuId].count
        }
    );

    const increase = document.createElement('button');
    increase.classList.add('increase', 'change-amount');
    increase.setAttribute('data-change-direction', '1');

    const arrowIncrease = Object.assign(
        document.createElement('img'),
        {
            src: 'images/chevron.svg',
            alt: 'amount increase',
            title: 'amount increase'
        }
    )
    increase.append(arrowIncrease);

    quantityWrapper.append(decrease, div, increase);

    return quantityWrapper;
}
function createPlateTotal(price){
    const total = document.createElement('div');
    total.classList.add('subtotal');
    total.innerHTML = price;
    return total;
}

function showInCart(menuId){
    menuItems[menuId].count = 1;
    const cart = document.querySelector('.cart-summary');
    const liItem = document.createElement('li');
    liItem.setAttribute('data-id', menuId);

    const price = countPlatePrice(menuId);
    const plate = createPlate(menuId);
    const content = createContent(menuId);
    const quantityWrapper = createQuantityWrapper(menuId);
    const total = createPlateTotal(price);

    liItem.append(plate, content, quantityWrapper, total);
    cart.append(liItem);

    writeSubtotal(menuItems[menuId].price);
}

function removeCursorFromInCartButtons(){
    let inCartButtons = document.querySelectorAll('.in-cart');
    inCartButtons.forEach(button => button.style.cursor = 'default')
}

function changeAddToCardButtonToInCart(button){
    button.classList.add('in-cart');
    button.classList.remove('add');
    button.innerHTML = `
            <img src="images/check.svg" alt="Check" />
            In Cart
        `;
    removeCursorFromInCartButtons();
}

function addToCart(button){
    if(button.classList?.contains('add')){
        const menuId = +button.parentElement.parentElement.getAttribute('data-id');
        changeAddToCardButtonToInCart(button);
        showInCart(menuId);
        isCartEmpty();
    }
}


function deletePlateFromCart(menuId){
    const cartSummary = document.querySelector('.cart-summary');
    let plate = cartSummary.querySelector(`[data-id='${menuId}']`);
    plate.remove();
}
function changeInCartButtonToAddToCard(menuId){
    let menuButton = document.querySelector(`.menu > [data-id="${menuId}"] button`);
    menuButton.classList.add('add');
    menuButton.classList.remove('in-cart');
    menuButton.addEventListener('click', addToCart);
    menuButton.style.cursor = "pointer";
    menuButton.innerHTML = "Add to Cart"
}
function changeAmount(button){
    const direction = parseInt(button.getAttribute('data-change-direction'));
    const parent = button.parentElement;
    const menuId = parent.parentElement.getAttribute('data-id');
    const quantity = parent.querySelector(`.quantity`);
    const plateQuantity = parent.parentElement.querySelector('.plate > .quantity');
    const subtotal = parent.parentElement.querySelector('.subtotal');
    menuItems[menuId].count += direction;
    const changePrice = menuItems[menuId].price * direction;

    if(menuItems[menuId].count !== 0){
        quantity.innerText = menuItems[menuId].count;
        subtotal.innerText = countPlatePrice(menuId);
        plateQuantity.innerText = menuItems[menuId].count;
    } else {
        deletePlateFromCart(menuId);
        changeInCartButtonToAddToCard(menuId);
    }
    writeSubtotal(changePrice);
    isCartEmpty();
}



    removeCursorFromInCartButtons();
    isCartEmpty();

    addButtons.forEach(el => el.addEventListener('click', function (){
        if(el.classList.contains('add')){
            addToCart(el)
        }
    }))
    cartSummary.addEventListener('click',  (e) => {
        if(e.target.classList.contains('change-amount')) {
            changeAmount(e.target)
        } else if (e.target.parentElement.classList.contains('change-amount')){
            changeAmount(e.target.parentElement)
        }
    })