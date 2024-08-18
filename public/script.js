document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('uploadButton');
    const fileUpload = document.getElementById('file-upload');
    const fileNameElement = document.getElementById('file-name');

    document.getElementById('download-beat').addEventListener('click', function() {
        const beatAudio = document.getElementById('beat');
        const beatUrl = beatAudio.src;
        const link = document.createElement('a');
        link.href = beatUrl;
        link.download = 'beat.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    document.getElementById('download-vocals').addEventListener('click', function() {
        const vocalsAudio = document.getElementById('vocals');
        const vocalsUrl = vocalsAudio.src;
        const link = document.createElement('a');
        link.href = vocalsUrl;
        link.download = 'vocals.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    if (!uploadButton) {
        console.error('uploadButton element not found');
        return;
    }

    if (!fileUpload) {
        console.error('file-upload element not found');
        return;
    }

    if (!fileNameElement) {
        console.error('file-name element not found');
        return;
    }

    uploadButton.addEventListener('click', function(event) {
        event.preventDefault();
        uploadFile();
    });

    fileUpload.addEventListener('change', function() {
        const fileName = this.files[0].name;
        fileNameElement.textContent = fileName;
        fileNameElement.classList.remove('hidden');
    });

    function resetScreen() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.textContent = '0%';
        }

        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.classList.add('hidden');
        }

        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
            resultsContainer.innerHTML = '';
        }

        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.classList.add('hidden');
        }

        hideAnalyzingAnimation();
    }

    function uploadFile() {
        const file = fileUpload.files[0];

        if (!file) {
            alert('Lütfen bir dosya seçin.');
            return;
        }

        resetScreen();

        showAnalyzingAnimation();

        const formData = new FormData();
        formData.append('song', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                const progressBar = document.getElementById('progress-bar');
                if (progressBar) {
                    progressBar.style.width = percentComplete + '%';
                    progressBar.textContent = Math.round(percentComplete) + '%';
                    document.getElementById('progress-container').classList.remove('hidden');

                    if (percentComplete === 100) {
                        setTimeout(function() {
                            document.getElementById('progress-container').classList.add('hidden');
                            showAnalyzingAnimation();
                        }, 500);
                    }
                } else {
                    console.error('progress-bar element not found');
                }
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log('Sunucu yanıtı:', response);
        
                const beatPath = response.accompaniment_path
                const vocalsPath = response.vocals_path;
        
                if (!beatPath || !vocalsPath) {
                    console.error('Sunucu yanıtında accompaniment_path veya vocals_path bulunamadı.');
                    alert('Dosya yüklenirken bir hata oluştu.');
                    hideAnalyzingAnimation();
                    return;
                }
        
                const resultsContainer = document.getElementById('results-container');
                if (resultsContainer) {
                    resultsContainer.innerHTML = `
                        <p>Dosya başarıyla yüklendi.</p>
                    `;
                    resultsContainer.classList.remove('hidden');
                } else {
                    console.error('results-container element not found.');
                }
        
                const resultElement = document.getElementById('result');
                if (resultElement) {
                    document.getElementById('beat').src = beatPath;
                    document.getElementById('vocals').src = vocalsPath;
                    document.getElementById('download-beat').href = beatPath.replace('.wav', '.mp3');
                    document.getElementById('download-vocals').href = vocalsPath.replace('.wav', '.mp3');
                    resultElement.classList.remove('hidden');
                } else {
                    console.error('result element not found.');
                }
        
                hideAnalyzingAnimation();
            } else {
                console.error('Sunucu hatası: ' + xhr.status);
                alert('Dosya yüklenirken bir hata oluştu.');
                hideAnalyzingAnimation();
            }
        };

        xhr.onerror = function() {
            console.error('İstek sırasında bir hata oluştu.');
            alert('Dosya yüklenirken bir hata oluştu.');
            hideAnalyzingAnimation();
        };

        xhr.ontimeout = function() {
            console.error('İstek zaman aşımına uğradı.');
            alert('Dosya yüklenirken zaman aşımına uğradı.');
            hideAnalyzingAnimation();
        };

        xhr.send(formData);
    }

    function hideAnalyzingAnimation() {
        const analyzingAnimation = document.getElementById('analyzing-animation');
        if (analyzingAnimation) {
            analyzingAnimation.classList.add('hidden');
        }
    }

    function showAnalyzingAnimation() {
        const analyzingAnimation = document.getElementById('analyzing-animation');
        if (analyzingAnimation) {
            analyzingAnimation.classList.remove('hidden');
        }
    }
});