// تهيئة الكانفا باستخدام Fabric.js
const canvas = new fabric.Canvas('canvas', {
    width: 503,
    height: 320,
    backgroundColor: '#ffffff',
});

// تحميل الصورة إلى الكانفا
fabric.Image.fromURL('./cnss_card.bmp', (img) => {
    if (!img) {
        console.error('فشل تحميل الصورة!');
        return;
    }
    img.scaleToWidth(503); // تغيير حجم الصورة لتناسب الكانفا
    img.scaleToHeight(320);
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top',
    });
    console.log('تم تحميل الصورة بنجاح!');
}, {
    crossOrigin: 'anonymous' // إضافة هذا الخيار لتجنب مشاكل CORS
});

// عناصر الفورم
const textForm = document.getElementById('textForm');
const addTextBtn = document.getElementById('addTextBtn');
const saveImageBtn = document.getElementById('saveImageBtn');
const layersPanel = document.getElementById('layersPanel');

// إضافة النصوص إلى الكانفا
addTextBtn.addEventListener('click', () => {
    const text = new fabric.Text(textForm.fullNameAr.value, {
        left: 50,
        top: 50,
        fontSize: parseInt(textForm.fontSize.value),
        fontFamily: textForm.fontFamily.value,
    });
    canvas.add(text);
    updateLayersPanel();
});

// تحديث Panel Layers
function updateLayersPanel() {
    layersPanel.innerHTML = '';
    canvas.getObjects().forEach((obj, index) => {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'flex items-center justify-between p-2 bg-gray-100 rounded-md';
        layerDiv.innerHTML = `
            <span>النص ${index + 1}</span>
            <div class="flex space-x-2">
                <button onclick="toggleVisibility(${index})" class="text-blue-500">إظهار/إخفاء</button>
                <button onclick="deleteLayer(${index})" class="text-red-500">حذف</button>
            </div>
        `;
        layersPanel.appendChild(layerDiv);
    });
}

// إظهار/إخفاء الطبقة
window.toggleVisibility = function (index) {
    const obj = canvas.getObjects()[index];
    obj.set({ visible: !obj.visible });
    canvas.renderAll();
};

// حذف الطبقة
window.deleteLayer = function (index) {
    const obj = canvas.getObjects()[index];
    canvas.remove(obj);
    updateLayersPanel();
};

// حفظ الصورة
saveImageBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL({ format: 'png', quality: 1 });
    link.download = 'صورة_مخصصة.png';
    link.click();
});

