import city from './assets/imgs/city.jpg';
import coffee from './assets/imgs/coffe.jpg';
import forest from './assets/imgs/forest.jpg';
import hello from './assets/gifs/hello.gif';
import ocean from './assets/imgs/ocean.jpg';

const data = [
    {
        src: city,
        type: 'img/gif'
    },
    {
        src: coffee,
        type: 'img/gif'
    }, 
    {
        src: 'https://tutorialehtml.com/assets_tutorials/media/Shaun-the-Sheep-The-Movie-Official-Trailer.mp4',
        type: 'video'
    }, 
    {
        src: forest,
        type: 'img/gif'
    }, 
    {
        src: hello,
        type: 'img/gif'
    }, 
    {
        src: {
            title: 'Lorem Ipsum',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius vehicula nisl, eget maximus nisi efficitur et. Donec a enim nibh. Morbi tempor bibendum tellus vel rutrum. Nullam nec cursus tellus. Proin augue nisi, egestas at egestas in, tincidunt ut est.'
        },
        type: 'text'
    },
    {
        src: ocean,
        type: 'img/gif'
    }
];

export default data;