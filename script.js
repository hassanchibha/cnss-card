// تهيئة Paper.js مع أبعاد الكانفا 503x320
const canvas = document.getElementById('canvas');
canvas.width = 700;
canvas.height = 446;

// تحميل مكتبة Paper.js
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
	'https://i.postimg.cc/yd9W06HK/t1.png',
	'https://i.postimg.cc/rp7Kd07g/t2.png',
];

let currentImageIndex = 0; // الفهرس الحالي للصورة
let raster = null; // الصورة الحالية في الكانفاس

// تحميل الصورة الأولى عند بدء التطبيق
loadImage(images[currentImageIndex]);

// دالة لتحميل الصورة
function loadImage(imageUrl) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageUrl;
    image.onload = () => {
        if (raster) {
            raster.remove(); // إزالة الصورة القديمة إذا كانت موجودة
        }
        raster = new paper.Raster(image);
        raster.position = paper.view.center;
        raster.scale(Math.min(
            canvas.width / raster.bounds.width,
            canvas.height / raster.bounds.height
        ));
        console.log('تم تحميل الصورة بنجاح:', raster);

        // إعادة رسم النصوص بعد تحميل الصورة الجديدة
        redrawTexts();
    };
}

// دالة لإعادة رسم النصوص
function redrawTexts() {
    texts.forEach(text => {
        const textItem = new paper.PointText({
            content: text.content,
            fillColor: text.fillColor,
            fontFamily: text.fontFamily,
            fontSize: text.fontSize,
            point: text.point, // استخدام الإحداثيات المحفوظة
        });

        // تمكين السحب والإفلات
        textItem.onMouseDrag = (event) => {
            textItem.position = textItem.position.add(event.delta);
        };

        // تحديد النص عند دخول الماوس إليه
        textItem.onMouseEnter = () => {
            if (selectedText) {
                selectedText.strokeColor = null; // إزالة حدود التحديد السابق
            }
            selectedText = textItem;
            textItem.strokeColor = 'blue'; // إضافة حدود زرقاء للنص المحدد
            textItem.strokeWidth = 2; // تحديد عرض الحدود
        };

        // تعديل النص عند النقر المزدوج
        textItem.onDoubleClick = () => {
            openEditModal(textItem); // فتح نافذة التعديل
            selectedText = textItem; // تعيين النص المحدد
        };
    });
}

// دالة لتغيير الصورة
function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = images.length - 1; // الانتقال إلى آخر صورة إذا كان الفهرس أقل من 0
    } else if (currentImageIndex >= images.length) {
        currentImageIndex = 0; // الانتقال إلى أول صورة إذا كان الفهرس أكبر من طول المصفوفة
    }
    loadImage(images[currentImageIndex]); // تحميل الصورة الجديدة
}

let selectedText = null; // النص المحدد حاليًا
const texts = []; // قائمة النصوص

// نافذة التعديل المخصصة
const editModal = document.getElementById('editModal');

// فتح نافذة التعديل
function openEditModal(textItem) {
    // تعبئة الحقول بالقيم الحالية
    document.getElementById('editTextContent').value = textItem.content;
    document.getElementById('editTextSize').value = textItem.fontSize;
    document.getElementById('editTextFont').value = textItem.fontFamily;
    document.getElementById('editTextColor').value = textItem.fillColor.toCSS(true); // تعيين لون النص الحالي

    // إظهار النافذة
    editModal.style.display = 'block';
    // إظهار طبقة Overlay
    document.getElementById('canvas-overlay').style.display = 'block';
    selectedText = textItem; // تعيين النص المحدد
}

// إغلاق نافذة التعديل
function closeEditModal() {
    editModal.style.display = 'none';
    // إخفاء طبقة Overlay
    document.getElementById('canvas-overlay').style.display = 'none';
}

// حفظ التغييرات
function saveTextChanges() {
    if (selectedText) {
        // تطبيق التغييرات
        selectedText.content = document.getElementById('editTextContent').value;
        selectedText.fontSize = parseInt(document.getElementById('editTextSize').value);
        selectedText.fontFamily = document.getElementById('editTextFont').value;
        selectedText.fillColor = document.getElementById('editTextColor').value; // تطبيق لون النص الجديد

        // إغلاق النافذة
        closeEditModal();
    } else {
        console.log('لا يوجد نص محدد.'); // تحقق من أن النص غير محدد
    }
}

// تغيير نوع الخط في الحقول عند تغيير القائمة المنسدلة
function changeInputFonts() {
    const fontFamily = document.getElementById('fontFamily').value;
    const inputs = document.querySelectorAll('#form-content input, #form-content select');
    inputs.forEach(input => {
        input.style.fontFamily = fontFamily;
    });
}

// إحداثيات محددة لكل حقل
const fieldPositions = {
    immatriculation: { x: 223, y: 107 },   // إحداثيات حقل immatriculation
    fullNameAr: { x: 55, y: 153 },       // إحداثيات حقل fullNameAr
    fullNameFr: { x: 153, y: 193 },       // إحداثيات حقل fullNameFr
    birthDate: { x: 162, y: 230 },        // إحداثيات حقل birthDate
    cin: { x: 130, y: 270 },              // إحداثيات حقل cin
    idcs: { x: 103, y: 306 },             // إحداثيات حقل idcs
};

// إضافة نص إلى اللوحة
function addText() {
    const immatriculation = document.getElementById('immatriculation').value;
    const fullNameAr = document.getElementById('fullNameAr').value;
    const fullNameFr = document.getElementById('fullNameFr').value;
    const birthDate = document.getElementById('birthDate').value;
    const cin = document.getElementById('cin').value;
    const idcs = document.getElementById('idcs').value;
    const fontFamily = document.getElementById('fontFamily').value;

    // تحويل النصوص إلى أحرف كبيرة
    const immatriculationUpper = immatriculation.toUpperCase();
    const fullNameArUpper = fullNameAr.toUpperCase();
    const fullNameFrUpper = fullNameFr.toUpperCase();
    const birthDateUpper = birthDate.toUpperCase();
    const cinUpper = cin.toUpperCase();
    const idcsUpper = idcs.toUpperCase();

    // إضافة النصوص إلى الـ Canvas فقط إذا كانت غير فارغة
    if (immatriculation) {
        addFieldToCanvas(immatriculationUpper, fieldPositions.immatriculation, fontFamily, 'black');
    }
    if (fullNameAr) {
        addFieldToCanvas(fullNameArUpper, fieldPositions.fullNameAr, fontFamily, 'black');
    }
    if (fullNameFr) {
        addFieldToCanvas(fullNameFrUpper, fieldPositions.fullNameFr, fontFamily, 'black');
    }
    if (birthDate) {
        addFieldToCanvas(birthDateUpper, fieldPositions.birthDate, fontFamily, 'black');
    }
    if (cin) {
        addFieldToCanvas(cinUpper, fieldPositions.cin, fontFamily, 'black');
    }
    if (idcs) {
        addFieldToCanvas(idcsUpper, fieldPositions.idcs, fontFamily, 'black');
    }
	// إفراغ الحقول بعد إضافة النصوص
    document.getElementById('immatriculation').value = '';
    document.getElementById('fullNameAr').value = '';
    document.getElementById('fullNameFr').value = '';
    document.getElementById('birthDate').value = '';
    document.getElementById('cin').value = '';
    document.getElementById('idcs').value = '';
}

// دالة مساعدة لإضافة حقل إلى الـ Canvas
function addFieldToCanvas(text, position, fontFamily, color) {
    const textItem = new paper.PointText({
        content: text,
        fillColor: color,
        fontFamily: fontFamily,
        fontSize: 20,
        point: [position.x, position.y], // استخدام الإحداثيات المحددة
    });

    // تمكين السحب والإفلات
    textItem.onMouseDrag = (event) => {
        textItem.position = textItem.position.add(event.delta);
    };

    // تحديد النص عند دخول الماوس إليه
    textItem.onMouseEnter = () => {
        if (selectedText) {
            selectedText.strokeColor = null; // إزالة حدود التحديد السابق
        }
        selectedText = textItem;
        textItem.strokeColor = 'blue'; // إضافة حدود زرقاء للنص المحدد
        textItem.strokeWidth = 2; // تحديد عرض الحدود
    };

    // تعديل النص عند النقر المزدوج
    textItem.onDoubleClick = () => {
        openEditModal(textItem); // فتح نافذة التعديل
        selectedText = textItem; // تعيين النص المحدد
    };

    texts.push(textItem);
}

// استماع للنقر خارج النص
paper.view.onMouseDown = (event) => {
    const clickedOnText = texts.some(text => text.hitTest(event.point));
    if (!clickedOnText && selectedText) {
        selectedText.strokeColor = null; // إزالة حدود التحديد
        selectedText = null; // إعادة تعيين selectedText
    }
};

// تكبير النص المحدد
function zoomInText() {
    if (selectedText) {
        selectedText.fontSize += 1; // زيادة حجم الخط بمقدار 1
    }
}

// تصغير النص المحدد
function zoomOutText() {
    if (selectedText && selectedText.fontSize > 1) {
        selectedText.fontSize -= 1; // تقليل حجم الخط بمقدار 1
    }
}

// استماع لأحداث عجلة الماوس (Mouse Wheel)
document.addEventListener('wheel', (event) => {
    if (selectedText) {
        event.preventDefault(); // منع السلوك الافتراضي (التكبير/التصغير في الصفحة)
        if (event.deltaY < 0) {
            // التكبير عند تحريك العجلة للأعلى
            zoomInText();
        } else {
            // التصغير عند تحريك العجلة للأسفل
            zoomOutText();
        }
    }
}, { passive: false }); // إضافة { passive: false } لمنع التحذير

// استماع لضغطات المفاتيح لحذف النص المحدد
document.addEventListener('keydown', (event) => {
    if (event.key === 'Delete' && selectedText) {
        const index = texts.indexOf(selectedText);
        if (index !== -1) {
            selectedText.remove(); // إزالة النص من الكانفاس
            texts.splice(index, 1); // إزالة النص من القائمة
            selectedText = null; // إعادة تعيين النص المحدد
        }
    }
});

// حفظ الصورة
function saveImage() {
    const canvas = document.getElementById('canvas');
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'صورة_مخصصة.png';
    link.click();
}
