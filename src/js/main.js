//= supportIE.js

Storage.prototype.setObj = function(key, obj)  {
    return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key)) || [];
}

/*Функции для добавления и извлечения элемента в корзину (в LocalStorage)*/		
const nameLS = 'cart';

const addProductInLS = id => {	
	if (window.localStorage) {
		let productsInCart = localStorage.getObj(nameLS);
		productsInCart = [...productsInCart.filter(el => el != id), id];
		localStorage.setObj(nameLS, productsInCart);		
	}
}
const loadCart = () => {
	const productsInCart = localStorage.getObj(nameLS);
	if(productsInCart.length){
		const productId = document.querySelectorAll('[data-id]');
		[].forEach.call(productId,  el => {
			if ( productsInCart.indexOf( el.getAttribute('data-id') ) != -1 ){
				buttonModify(el.querySelector('.js-btn-buy'));
			}
		});
	}
}

/*Обработчик нажатия кнопки "Купить"*/
const buttonModify = (btn) => {
	btn.innerText = 'В корзине';
	btn.classList.add('button_in-cart');
} 

const buyBtnHandler = e => {
	const button = e.target;
	if(!button.classList.contains('button_in-cart')){
		const productId = button.closest('[data-id]').getAttribute('data-id');
		const url = 'https://jsonplaceholder.typicode.com/posts/1';

		button.classList.add('button_loading');

		fetch(url)
			.then( () => {
				addProductInLS(productId);
				buttonModify(button);
			})  
			.catch( (err) => {  
				console.error('Возникла ошибка при добавлении в корзину: ', err);
			})
			.finally( () => {
				button.classList.remove('button_loading');
			});
		}	
};

document.addEventListener('DOMContentLoaded',  () => {
	loadCart();
	const buttons = document.querySelectorAll('.js-btn-buy');
	[].forEach.call(buttons, (el) => { 
		el.addEventListener('click', buyBtnHandler);
	});
}, false);