// scripts.js
const urls = [
    'capa.pdf',      // Substitua pelos nomes dos arquivos reais
    'pagina1.pdf',  
    'pagina2.pdf',  
    'pagina3.pdf',  
    'pagina4.pdf',  
    'pagina5.pdf'   
];

let currentPage = 0;
const pages = document.querySelectorAll('.page');
const totalPages = pages.length;

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

const loadPdf = (url, pageIndex) => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render({
                canvasContext: context,
                viewport: viewport
            }).promise.then(function() {
                document.getElementById(`page-${pageIndex + 1}`).appendChild(canvas);
            });
        });
    });
};

urls.forEach((url, index) => {
    loadPdf(url, index);
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        pages[currentPage].style.transform = 'rotateY(-180deg)';
        currentPage++;
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        pages[currentPage].style.transform = 'rotateY(0deg)';
    }
});
