// scripts.js
const urls = [
    'capa.pdf',
//    'pagina1.pdf',
  //  'pagina2.pdf',
    //'pagina3.pdf',
    //'pagina4.pdf',
    //'pagina5.pdf',
    //'pagina6.pdf',
];

let currentPage = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const loadPdf = (url, pageIndex) => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(pdf => {
        pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const container = document.getElementById(`page-${pageIndex}`);
            const containerRect = container.getBoundingClientRect();

            const scale = Math.min(containerRect.width / viewport.width, containerRect.height / viewport.height);

            canvas.width = viewport.width * scale;
            canvas.height = viewport.height * scale;

            const renderContext = {
                canvasContext: context,
                viewport: page.getViewport({ scale: scale })
            };

            page.render(renderContext).promise.then(() => {
                container.innerHTML = ''; // Clear existing content
                container.appendChild(canvas);
            });
        });
    });
};

urls.forEach((url, index) => {
    loadPdf(url, index); // Carrega cada página PDF
});

const navigateToPage = (pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
        pages[currentPage].classList.remove('active');
        pages[pageIndex].classList.add('active');
        currentPage = pageIndex;
    }
};

document.getElementById('next').addEventListener('click', () => {
    navigateToPage(currentPage + 1);
});

document.getElementById('prev').addEventListener('click', () => {
    navigateToPage(currentPage - 1);
});

// Adicione suporte para navegação por toque
let startX = 0;
let currentX = 0;

const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
    currentX = event.touches[0].clientX;
};

const handleTouchEnd = () => {
    if (startX - currentX > 50 && currentPage < totalPages - 1) {
        // Swipe para a esquerda
        navigateToPage(currentPage + 1);
    } else if (currentX - startX > 50 && currentPage > 0) {
        // Swipe para a direita
        navigateToPage(currentPage - 1);
    }
};

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);
