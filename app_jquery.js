const menuItems = [
    {
        name: 'French Fries with Ketchup',
        price: 223,
        image: 'plate__french-fries.png',
        alt: 'French Fries',
        count: 0
    },
    {
        name: 'Salmon and Vegetables',
        price: 512,
        image: 'plate__salmon-vegetables.png',
        alt: 'Salmon and Vegetables',
        count: 0
    },
    {
        name: 'Spaghetti Meat Sauce',
        price: 782,
        image: 'plate__spaghetti-meat-sauce.png',
        alt: 'Spaghetti with Meat Sauce',
        count: 0
    },
    {
        name: 'Bacon, Eggs, and Toast',
        price: 599,
        image: 'plate__bacon-eggs.png',
        alt: 'Bacon, Eggs, and Toast',
        count: 0
    },
    {
        name: 'Chicken Salad with Parmesan',
        price: 698,
        image: 'plate__chicken-salad.png',
        alt: 'Chicken Salad with Parmesan',
        count: 0
    },
    {
        name: 'Fish Sticks and Fries',
        price: 634,
        image: 'plate__fish-sticks-fries.png',
        alt: 'Fish Sticks and Fries',
        count: 0
    }
]
let subtotal = 0;
let tax = 0;

function isCartEmpty(){
    const cartElements = $('.cart-summary li');
    if(cartElements.length == 0){
        $('.empty').show();
    } else {
        $('.empty').hide();
    }
}

function countSubtotal(price){
   /* subtotal
    const totals = $('.cart-summary .subtotal');
    $.each(totals, total => {

    })*/
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
    price = price/100;
    price = price.toFixed(2);
    return price;
}

function writeSubtotal(price){
    countSubtotal(price);
    countTax();
    const total = (subtotal+tax).toFixed(2);

    $('.totals .subtotal').empty().text('$' + subtotal);
    $('.totals .tax').empty().text('$' + tax);
    $('.totals .total .total').empty().text('$' + total);
}

function createPlate(menuId){
    const plate = $('<div>', {
        class: 'plate'
    });
    $('<img>', {
        src: `images/${menuItems[menuId].image}`,
        alt: menuItems[menuId].name,
        class: 'plate'
    }).appendTo(plate);
    $('<div>', {
        class: 'quantity',
        text: menuItems[menuId].count
    }).appendTo(plate);

    return plate;
}
function createContent(menuId){
    const content = $('<div>', {
        class: 'content'
    });
    $('<p>', {
        class: 'menu-item',
        text: menuItems[menuId].name
    }).appendTo(content);
    $('<p>', {
        class: 'price',
        text: '$' + (menuItems[menuId].price/100).toFixed(2)
    }).appendTo(content);

    return content;
}
function createQuantityWrapper(menuId){
    const quantityWrapper = $('<div>', {
        class: 'quantity__wrapper'
    });
    const decrease = $('<button>', {
        class: 'decrease change-amount',
        'data-change-direction': -1
    });
    $('<img>', {
        src: 'images/chevron.svg',
        alt: 'amount reduce',
        title: 'amount reduce'
    }).appendTo(decrease);
    decrease.appendTo(quantityWrapper);
    $('<div>', {
        class: 'quantity',
        text: menuItems[menuId].count
    }).appendTo(quantityWrapper);
    const increase = $('<button>', {
        class: 'increase change-amount',
        'data-change-direction': 1
    });
    $('<img>', {
        src: 'images/chevron.svg',
        alt: 'amount increase',
        title: 'amount increase'
    }).appendTo(increase);
    increase.appendTo(quantityWrapper);

    return quantityWrapper;
}
function createPlateTotal(price){
    return $('<div>', {
        class: 'subtotal',
        text: price
    });
}

function showInCart(menuId){
    menuItems[menuId].count = 1;
    const cart = $('.cart-summary');
    const liItem = $('<li>', {
        'data-id': menuId
    });
    const price = countPlatePrice(menuId);

    createPlate(menuId).appendTo(liItem);
    createContent(menuId).appendTo(liItem);
    createQuantityWrapper(menuId).appendTo(liItem);
    createPlateTotal(price).appendTo(liItem);
    liItem.appendTo(cart);
    writeSubtotal(menuItems[menuId].price/100);
}

function removeCursorFromInCartButtons(){
    $('.in-cart')
        .css('cursor', 'default')
}

function changeAddToCardButtonToInCart(button){
    $(button)
        .addClass('in-cart')
        .removeClass('add')
        .empty()
        .off('click')
        .html(`
            <img src="images/check.svg" alt="Check" />
            In Cart
        `);
    removeCursorFromInCartButtons();
}

function addToCart(clickedButton){
    const button = clickedButton.target;
    const menuId = +$(button).parent().parent().attr('data-id');
    changeAddToCardButtonToInCart(button);
    showInCart(menuId);
    isCartEmpty();
}


function deletePlateFromCart(menuId){
    $('.cart-summary')
        .find(`[data-id='${menuId}']`)
        .remove()
}
function changeInCartButtonToAddToCard(menuId){
    let menuButton = $('.menu').find(`[data-id='${menuId}'] button`);
    $(menuButton)
        .addClass('add')
        .removeClass('in-cart')
        .empty()
        .on('click', addToCart)
        .css('cursor', 'pointer')
        .html(`
            Add to Cart
        `);
}
function changeAmount(clickedButton){
    const button = clickedButton.currentTarget;
    const direction = +$(button).attr('data-change-direction');
    const menuId = $(button).parent().parent().attr('data-id');
    const quantity = $(button).siblings('.quantity');
    const plateQuantity = $(button).parent().siblings('.plate').children('.quantity');
    const subtotal = $(button).parent().next('.subtotal');
    menuItems[menuId].count += direction;
    const changePrice = menuItems[menuId].price / 100 * direction;

    if(menuItems[menuId].count !== 0){
        $(quantity).text(menuItems[menuId].count);
        subtotal.text(countPlatePrice(menuId));
        plateQuantity.text(menuItems[menuId].count);
    } else {
        deletePlateFromCart(menuId);
        changeInCartButtonToAddToCard(menuId);
    }
    writeSubtotal(changePrice);
    isCartEmpty();
}

$(document).ready(function (){
    removeCursorFromInCartButtons();
    isCartEmpty();
   $('.add').on('click', addToCart);
   $('.cart-summary').on('click', '.change-amount', changeAmount);
});
