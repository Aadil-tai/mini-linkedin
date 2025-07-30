// Test ImgBB upload directly
// Paste this in your browser console to test ImgBB

const testImgBBUpload = async () => {
    // Create a test canvas image
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);

    // Convert to blob
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'test.png');

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=6988219594fc863fea770efcef82d728`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();
            console.log('ImgBB Response:', data);

            if (data.success) {
                console.log('✅ ImgBB working! Image URL:', data.data.url);
            } else {
                console.log('❌ ImgBB failed:', data);
            }
        } catch (error) {
            console.error('❌ ImgBB error:', error);
        }
    });
};

// Run the test
testImgBBUpload();
