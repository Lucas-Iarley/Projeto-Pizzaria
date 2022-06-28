const  cqs = (i)=>{
	return document.querySelector(i);//essa função permite usar qualquer document.querySe..
	//apenas chamando-o
	//assim deixa mais curto e organizado
}
const todos = (i)=>document.querySelectorAll(i);

let car = [];// var do carrinho

//variavel que irá armazenar a quantidade de itens selecionardos
let qnt = 0;

let modalKey = 0;

pizzaJson.map((item, index) =>{
	let pizzaitem = document.querySelector('.models .pizza-item').cloneNode(true);
	//o clonenode clona tudo dentro de um elemento
	pizzaitem.setAttribute('data-key', index);//'data-key' é semelhante a um id, é só pra especificar um elemento 
	pizzaitem.querySelector('.pizza-item--img img').src = item.img;//acessando a tag img dentro da div
	pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
	pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description;
	
  //----evento de abertura do modal-----------------------------------;

	pizzaitem.querySelector('a').addEventListener('click', (e)=>{ 
		e.preventDefault();
		//preventDefault previne uma ação que nesse caso é a ação da ancora

		let key = e.target.closest('.pizza-item').getAttribute('data-key');
		// o target(o proprio elemento) e o closest acha o elemento mais proximo do 'a'
		// e o getAttribute pega o atributo que é o data-key
		console.log(pizzaJson[key]);

		modalKey = key; // colocará todas as informações do key dentro do modal
		qnt = 1;
		cqs('.pizzaBig img').src = pizzaJson[key].img; //adiciona a imagem do json
		cqs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;//adiciona o nome do json
		cqs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;//adiciona a descrição do json
		cqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;;		
		cqs('.pizzaInfo--size ').classList.remove('selected');//acessa o item selecionado e remove a classes selecionada
		

		todos('.pizzaInfo--size').forEach((size, sizeIndex)=>{
				//forEach é para cada valor daquele elemento selecionado
				
							if(sizeIndex == 2){
								size.classList.add('selected');
								//o sizeindex é o data-key
			
											}

				size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex] ;

							})
		cqs('.pizzaInfo--qt').innerHTML = qnt;

		cqs('.pizzaWindowArea').style.opacity = 0;
		cqs('.pizzaWindowArea').style.display = 'flex';
		setTimeout(()=>{
			cqs('.pizzaWindowArea').style.opacity = 1;
			//deppis de 0,5 s a opacidade será 1
			}, 200);
									
						});
	//preeencher as informaçõeses de pizzaitem
	cqs('.pizza-area').append(pizzaitem);//append adiciona mais um conteudo
});

//------função de cancelar e voltar -------------;

	function closeModal(){
		cqs('.pizzaWindowArea').style.opacity = 0;
		setTimeout(()=>{
			cqs('.pizzaWindowArea').style.display = 'none';
			}, 200);
	}
	

//-----botões de mais e menos ----------------------------------------

cqs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
	if(qnt > 1){
		qnt--;
	cqs('.pizzaInfo--qt').innerHTML = qnt;}

});
cqs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
	qnt++;
	cqs('.pizzaInfo--qt').innerHTML = qnt;
	
})
//-------- fazendo o mesmo com os tamanhos

todos('.pizzaInfo--size').forEach((size, sizeIndex)=>{
	size.addEventListener('click', (i)=>{
		//essa lógica é usada em um sistema em que tem que marcar uma das opções
		//e desmarcar as outras
		cqs('.pizzaInfo--size.selected').classList.remove('selected');
		i.target.classList.add('selected');
		//o target seleciona o proprio item

		});		
});

//---------------- ADICIONAR NO CARRINHO -----------------


	cqs('.pizzaInfo--addButton').addEventListener('click', ()=>{
		//Qual a pizza
		console.log('pizza '+modalKey );
		//qual o tamanhho
		let size = parseInt(cqs('.pizzaInfo--size.selected').getAttribute('data-key'));
			//pega o valor do atributo data-key da pizza selecionada


	//---identificando os itens no carinhos

		let identifier = pizzaJson[modalKey].id+'@'+size;
		let key = car.findIndex((i)=>{
				i.identifier == identifier;
		});

		//se achar o item ele irá parao else, se não, retornará -1 eseguirá o if
		if(key > -1){
			car[key].qt += qnt; 
			// se não achou o item, ele adicionará

		}else {

		car.push({
			identifier,
			id:pizzaJson[modalKey].id,
			size:size,
			qt:qnt
		})//colocas essas infomações na lista car

		updateCar();
		closeModal();
			}
	})

	//------------------- ATUALIZANDO O CARRINHO------

	function updateCar(){
		
		cqs('.menu-openner span').innerHTML = car.length;

		if(car.length > 0){
			cqs('aside').classList.add('show');
			//caso o carrinho tenha uma aadição eprodutos,
			//uma class será adicionada no aside(olhe a class show no arquivo css)
			cqs('.cart').innerHTML = ' ';

			let subtotal = 0;
			let desconto = 0;
			let total = 0;

			for(let i in car){//for mapea o array

				let pizzaitem = pizzaJson.find((item)=> item.id == car[i].id);
				subtotal += pizzaitem.price * car[i].qt;

				let cartItem = cqs('.models .cart--item').cloneNode(true);//clona os itens

				let pizzaSize;

				switch(car[i].size) {
					case 0 ://data-key 0
						pizzaSize = "P";
						break
					case 1 ://data-key 1
						pizzaSize = "M";
						break
					case 2 : //data-key 2
						pizzaSize = "G";
						break
									}

				//-----adicionando os valores no carrinho
				let pizzaName = `${pizzaitem.name} (${pizzaSize})`;

				cartItem.querySelector('img').src = pizzaitem.img;
				cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
				cartItem.querySelector('.cart--item--qt').innerHTML = car[i].qt;
				cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
					if(car[i].qt > 1) {
						car[i].qt--;

					} else {
						car.splice(i, 1);				

							}
					

					updateCar();
				});

				cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
						car[i].qt++;//incrementa um item especifico no item
						updateCar();//atualiza o carrnho... é um callBack do proprio
				})


				cqs('.cart').append(cartItem);//adiciona os itens clonados na div cart
			}
			desconto = subtotal * 0.1;
			total = subtotal - desconto ;

			cqs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
			cqs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
			cqs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

		} else{

			cqs('aside').classList.remove('show');
			cqs('aside').style.left = '100vw';
			
			}
		

	}
	//----abrir o carrinho no moblie -------

	cqs('.menu-openner span').addEventListener('click', ()=>{
		if(car.length > 0){// se tiver itens no carrinho abrirá o carrinho no mobile
			cqs('aside').style.left = '0';
		}

	})
	cqs('.menu-closer').addEventListener('click', ()=>{
			cqs('aside').style.left = '100vw';

	})