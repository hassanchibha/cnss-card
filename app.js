const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
	img.crossOrigin = 'Anonymous';
    img.src = 'cnss-card.jpg'; // ضع مسار الصورة
    let imgLoaded = false;
	let offsetX = 0;
	let offsetY = 0;

    // تعيين مواقع النصوص
    const textPositions = {
      registrationNumber: { x: 142, y: 69 },
      surname: { x: 192, y: 96 },
      nom: { x: 44, y: 96 },
      name: { x: 179, y: 121 },
      prenom: { x: 57, y: 121 },
      birthDate: { x: 150, y: 146 },
      idNumber: { x: 113, y: 168 },
      registrationDate: { x: 138, y: 193 },
    };

	// الحجم الحقيقي
    const realWidth = canvas.width;
	const realHeight = canvas.height;

	// الحجم الظاهر
	const displayedWidth = parseInt(getComputedStyle(canvas).width);
	const displayedHeight = parseInt(getComputedStyle(canvas).height);

	// النسبة بين الحجم الحقيقي والحجم الظاهر
	const scaleX = realWidth / displayedWidth;
	const scaleY = realHeight / displayedHeight;

	// لتحويل الإحداثيات الظاهرة إلى الحقيقية
	function toRealCoords(x, y) {
		return {
			x: x * scaleX,
			y: y * scaleY,
		};
	}

// لتحويل الإحداثيات الحقيقية إلى الظاهرة (اختياري)
	function toDisplayedCoords(x, y) {
	  return {
		x: x / scaleX,
		y: y / scaleY,
	  };
	}
	
    img.onload = () => {
      imgLoaded = true;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawText();
    };

    function drawText() {
      if (!imgLoaded) return;
	  ctx.clearRect(0, 0, canvas.width, canvas.height); // مسح الصورة القديمة
      // إعادة رسم الصورة
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // إعدادات الخط
      const fontSize = document.getElementById('fontSize').value;
      const fontFamily = document.getElementById('fontFamily').value;
      ctx.font = `${fontSize}px ${fontFamily}`;
	  ctx.fillStyle = 'black';

	   // رسم النصوص
    for (const key in textPositions) {
        const textValue = document.getElementById(key).value;
        const textPos = textPositions[key];

        // اختيار اللون بناءً على النص
        if (key === 'registrationNumber') {
            ctx.fillStyle = 'white'; // اللون الأبيض لرقم التسجيل
        } else {
            ctx.fillStyle = 'black'; // اللون الأسود للنصوص الأخرى
        }

        // رسم النص
        ctx.fillText(textValue.toUpperCase(), textPos.x, textPos.y);
    }
    }
	
	function isMouseOverText(mouseX, mouseY, text, x, y) {
	  const metrics = ctx.measureText(text);
	  const textWidth = metrics.width;
	  const textHeight = parseInt(ctx.font); // ارتفاع الخط يكون نفس حجم الخط
	  return (
		mouseX >= x &&
		mouseX <= x + textWidth &&
		mouseY >= y - textHeight &&
		mouseY <= y
	  );
	}


    // إضافة النصوص عند الضغط على زر "أضف المعلومات"
    document.getElementById('updateCanvas').addEventListener('click', () => {
      drawText();
    });

    // حفظ الصورة عند الضغط على زر "حفظ الصورة"
    document.getElementById('download').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // مسح الـ canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // إعادة رسم الصورة الأصلية
      drawText(); // رسم النصوص مرة أخرى
	  
	  const link = document.createElement('a');
      link.download = 'health-card.png';
      link.href = canvas.toDataURL();
      link.click();
    });

    // تحريك النص باستخدام الماوس
    let isDragging = false;
    let draggedText = null;

    canvas.addEventListener('mousedown', (e) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
	
	  // تحويل الإحداثيات الظاهرة إلى الحقيقية
	  const { x, y } = toRealCoords(mouseX, mouseY);
	
      // التحقق من النصوص بناءً على الإحداثيات الحقيقية
      for (const key in textPositions) {
        const text = document.getElementById(key).value;
        const textPos = textPositions[key];

        const fontSize = document.getElementById('fontSize').value;
        const fontFamily = document.getElementById('fontFamily').value;
        ctx.font = `${fontSize}px ${fontFamily}`;

        if (isMouseOverText(x, y, text, textPos.x, textPos.y)) {
            isDragging = true;
            draggedText = key;

            // حساب الفرق بين النص والماوس
            offsetX = x - textPos.x;
            offsetY = y - textPos.y;

            break;
        }
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDragging && draggedText) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // تحويل الإحداثيات الظاهرة إلى الحقيقية
        const { x, y } = toRealCoords(mouseX, mouseY);

        // تحديث موقع النص مع احتساب الفرق
        textPositions[draggedText].x = x - offsetX;
        textPositions[draggedText].y = y - offsetY;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // مسح الـ canvas
        drawText(); // إعادة رسم النصوص بعد التحريك
      }
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
      draggedText = null;
    });

    // تحريك النص باستخدام أزرار الكيبورد
    document.addEventListener('keydown', (e) => {
      if (!draggedText) return;

      const step = 5;
      if (e.key === 'ArrowUp') textPositions[draggedText].y -= step;
      if (e.key === 'ArrowDown') textPositions[draggedText].y += step;
      if (e.key === 'ArrowLeft') textPositions[draggedText].x -= step;
      if (e.key === 'ArrowRight') textPositions[draggedText].x += step;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // مسح الـ canvas
      drawText(); // إعادة رسم النصوص بعد التحريك
    });
	
	canvas.addEventListener('mousedown', (e) => {
	  const mouseX = e.offsetX;
	  const mouseY = e.offsetY;

	  for (const key in textPositions) {
		const text = document.getElementById(key).value;
		const textPos = textPositions[key];

		const fontSize = document.getElementById('fontSize').value;
		const fontFamily = document.getElementById('fontFamily').value;
		ctx.font = `${fontSize}px ${fontFamily}`;

		if (isMouseOverText(mouseX, mouseY, text, textPos.x, textPos.y)) {
		  isDragging = true;
		  draggedText = key;
		  break;
		}
	  }
	});