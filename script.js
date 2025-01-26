// تهيئة Paper.js مع أبعاد الكانفاس
const canvas = document.getElementById('canvas');
canvas.width = 700;
canvas.height = 446;
paper.setup(canvas);

// قائمة عناوين الصور
const images = [
    'https://i.postimg.cc/3Jh0CGNc/M1.png',
    'https://i.postimg.cc/T16108dD/M2.png',
    'https://i.postimg.cc/6qf31Hq1/M3.png',
    'https://i.postimg.cc/3xJyzHgj/M4.png',
    'https://i.postimg.cc/Z579SDcG/M5.png',
    'https://i.postimg.cc/SNG2ZKzN/M6.png',
    'https://i.postimg.cc/CKRRLHrz/M7.png',
    'https://i.postimg.cc/W1GXKtHh/t1.png',
    'https://i.postimg.cc/6pJMYCzk/t2.png'
];

let currentImageIndex = 0;
let raster = null;
let selectedText = null;
const texts = [];

// تحميل الصورة الأولى عند بدء التطبيق
loadImage(images[currentImageIndex]);

function loadImage(imageUrl) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = () => {
        if (raster) raster.remove();
        raster = new paper.Raster(image);
        raster.position = paper.view.center;
        raster.scale(Math.min(canvas.width / raster.bounds.width, canvas.height / raster.bounds.height));
        redrawTexts();
    };
}

function redrawTexts() {
    texts.forEach(text => {
        const textItem = new paper.PointText({
            content: text.content,
            fillColor: text.fillColor,
            fontFamily: text.fontFamily,
            fontSize: text.fontSize,
            point: text.point,
        });

        textItem.onMouseDrag = (event) => {
            textItem.position = textItem.position.add(event.delta);
        };

        // تحديد النص عند النقر بالماوس
        textItem.onMouseDown = () => {
            if (selectedText) selectedText.strokeColor = null; // إزالة تحديد النص السابق
            selectedText = textItem;
            textItem.strokeColor = 'red'; // تغيير لون النص المحدد إلى الأحمر
            textItem.strokeWidth = 2;
        };

        // تعديل النص عند النقر المزدوج
        textItem.onDoubleClick = () => {
            openEditModal(textItem);
            selectedText = textItem;
        };
    });
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = images.length - 1;
    else if (currentImageIndex >= images.length) currentImageIndex = 0;
    loadImage(images[currentImageIndex]);
}

const editModal = document.getElementById('editModal');

function openEditModal(textItem) {
    document.getElementById('editTextContent').value = textItem.content;
    document.getElementById('editTextSize').value = textItem.fontSize;
    document.getElementById('editTextFont').value = textItem.fontFamily;
    document.getElementById('editTextColor').value = textItem.fillColor.toCSS(true);
    editModal.style.display = 'block';
    document.getElementById('canvas-overlay').style.display = 'block';
    selectedText = textItem;
}

function closeEditModal() {
    editModal.style.display = 'none';
    document.getElementById('canvas-overlay').style.display = 'none';
}

function saveTextChanges() {
    if (selectedText) {
        selectedText.content = document.getElementById('editTextContent').value.toUpperCase();
        selectedText.fontSize = parseInt(document.getElementById('editTextSize').value);
        selectedText.fontFamily = document.getElementById('editTextFont').value;
        selectedText.fillColor = document.getElementById('editTextColor').value;
        closeEditModal();
    }
}

function changeInputFonts() {
    const fontFamily = document.getElementById('fontFamily').value;
    const inputs = document.querySelectorAll('#form-content input, #form-content select');
    inputs.forEach(input => input.style.fontFamily = fontFamily);
}

const fieldPositions = {
    immatriculation: { x: 223, y: 107 },
    fullNameAr: { x: 55, y: 153 },
    fullNameFr: { x: 153, y: 193 },
    birthDate: { x: 162, y: 230 },
    cin: { x: 130, y: 270 },
    idcs: { x: 103, y: 306 },
};

function addText() {
    const immatriculation = document.getElementById('immatriculation').value;
    const fullNameAr = document.getElementById('fullNameAr').value;
    const fullNameFr = document.getElementById('fullNameFr').value;
    const birthDate = document.getElementById('birthDate').value;
    const cin = document.getElementById('cin').value;
    const idcs = document.getElementById('idcs').value;
    const fontFamily = document.getElementById('fontFamily').value;

    if (immatriculation) addFieldToCanvas(immatriculation.toUpperCase(), fieldPositions.immatriculation, fontFamily, 'black');
    if (fullNameAr) addFieldToCanvas(fullNameAr.toUpperCase(), fieldPositions.fullNameAr, fontFamily, 'black');
    if (fullNameFr) addFieldToCanvas(fullNameFr.toUpperCase(), fieldPositions.fullNameFr, fontFamily, 'black');
    if (birthDate) addFieldToCanvas(birthDate.toUpperCase(), fieldPositions.birthDate, fontFamily, 'black');
    if (cin) addFieldToCanvas(cin.toUpperCase(), fieldPositions.cin, fontFamily, 'black');
    if (idcs) addFieldToCanvas(idcs.toUpperCase(), fieldPositions.idcs, fontFamily, 'black');

    document.getElementById('immatriculation').value = '';
    document.getElementById('fullNameAr').value = '';
    document.getElementById('fullNameFr').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('cin').value = '';
    document.getElementById('idcs').value = '';
}

function addFieldToCanvas(text, position, fontFamily, color) {
    const textItem = new paper.PointText({
        content: text,
        fillColor: color,
        fontFamily: fontFamily,
        fontSize: 20,
        point: [position.x, position.y],
    });

    textItem.onMouseDrag = (event) => {
        textItem.position = textItem.position.add(event.delta);
    };

    // تحديد النص عند النقر بالماوس
    textItem.onMouseDown = () => {
        if (selectedText) selectedText.strokeColor = null; // إزالة تحديد النص السابق
        selectedText = textItem;
        textItem.strokeColor = 'red'; // تغيير لون النص المحدد إلى الأحمر
        textItem.strokeWidth = 2;
    };

    // تعديل النص عند النقر المزدوج
    textItem.onDoubleClick = () => {
        openEditModal(textItem);
        selectedText = textItem;
    };

    texts.push(textItem);
}

// إلغاء تحديد النص عند النقر خارج النص
paper.view.onMouseDown = (event) => {
    const clickedOnText = texts.some(text => text.hitTest(event.point));
    if (!clickedOnText && selectedText) {
        selectedText.strokeColor = null; // إزالة تحديد النص
        selectedText = null;
    }
};

function zoomInText() {
    if (selectedText) selectedText.fontSize += 1;
}

function zoomOutText() {
    if (selectedText && selectedText.fontSize > 1) selectedText.fontSize -= 1;
}

document.addEventListener('wheel', (event) => {
    if (selectedText) {
        event.preventDefault();
        if (event.deltaY < 0) zoomInText();
        else zoomOutText();
    }
}, { passive: false });

document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete' && selectedText) {
        const index = texts.indexOf(selectedText);
        if (index !== -1) {
            selectedText.remove();
            texts.splice(index, 1);
            selectedText = null;
        }
    }
});

function saveImage() {
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'صورة_مخصصة.png';
    link.click();
}
