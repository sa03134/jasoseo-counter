let fieldCount = 4;

// 바이트 계산 함수 (잡코리아 공식 사이트와 동일한 EUC-KR 방식)
function getByteLength(str) {
  let byteLength = 0;
  
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    
    // ASCII 영역 (0-127): 1바이트
    if (charCode <= 0x7F) {
      byteLength += 1;
    }
    // 한글 및 2바이트 문자: 2바이트
    else if (charCode <= 0xFFFF) {
      byteLength += 2;
    }
    // 4바이트 문자 (이모지 등): surrogate pair 처리
    else {
      byteLength += 2;
      i++; // surrogate pair의 두 번째 문자 건너뛰기
    }
  }
  
  return byteLength;
}

// 글자수 및 바이트 업데이트
function updateStats(fieldWrapper) {
  const textarea = fieldWrapper.querySelector('.text-field');
  const charsSpan = fieldWrapper.querySelector('.chars');
  const bytesSpan = fieldWrapper.querySelector('.bytes');
  
  const text = textarea.value;
  const charCount = text.length;
  const byteCount = getByteLength(text);
  
  charsSpan.textContent = `${charCount.toLocaleString()}자`;
  bytesSpan.textContent = `${byteCount.toLocaleString()}B`;
}

// 필드 추가
function addField() {
  fieldCount++;
  const fieldsContainer = document.getElementById('fieldsContainer');
  
  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'field-wrapper';
  fieldWrapper.setAttribute('data-id', fieldCount);
  
  // 5번 문항부터는 삭제 버튼 추가
  const removeButton = fieldCount > 4 ? 
    `<button class="btn-remove" data-field-id="${fieldCount}" title="문항 삭제">×</button>` : '';
  
  fieldWrapper.innerHTML = `
    <div class="field-header">
      <span class="field-number">문항 ${fieldCount}</span>
      <div class="field-actions">
        <button class="btn-copy-field" data-field-id="${fieldCount}" title="텍스트 복사">📄</button>
        <button class="btn-copy-chars" data-field-id="${fieldCount}" title="공백포함 글자수 복사">字</button>
        <button class="btn-copy-bytes" data-field-id="${fieldCount}" title="바이트 복사">B</button>
        <button class="btn-clear" data-field-id="${fieldCount}" title="내용 지우기">🗑️</button>
        ${removeButton}
      </div>
      <div class="field-stats">
        <span class="stat-value chars">0자</span>
        <span class="stat-divider">/</span>
        <span class="stat-value bytes">0B</span>
      </div>
    </div>
    <textarea class="text-field" placeholder="자기소개서 내용을 입력하세요..."></textarea>
  `;
  
  fieldsContainer.appendChild(fieldWrapper);
  
  // 이벤트 리스너 추가
  const textarea = fieldWrapper.querySelector('.text-field');
  textarea.addEventListener('input', () => {
    updateStats(fieldWrapper);
    saveData();
  });
  textarea.addEventListener('paste', () => {
    setTimeout(() => {
      textarea.scrollTop = 0;
      saveData();
    }, 10);
  });
  
  fieldWrapper.querySelector('.btn-clear').addEventListener('click', () => clearField(fieldCount));
  fieldWrapper.querySelector('.btn-copy-field').addEventListener('click', () => copyFieldText(fieldCount));
  fieldWrapper.querySelector('.btn-copy-chars').addEventListener('click', () => copyChars(fieldCount));
  fieldWrapper.querySelector('.btn-copy-bytes').addEventListener('click', () => copyBytes(fieldCount));
  
  // 5번 이상 문항일 경우 삭제 버튼 이벤트 추가
  if (fieldCount > 4) {
    fieldWrapper.querySelector('.btn-remove').addEventListener('click', () => removeField(fieldCount));
  }
  
  // 애니메이션
  fieldWrapper.style.opacity = '0';
  fieldWrapper.style.transform = 'translateY(10px)';
  setTimeout(() => {
    fieldWrapper.style.transition = 'all 0.3s ease';
    fieldWrapper.style.opacity = '1';
    fieldWrapper.style.transform = 'translateY(0)';
  }, 10);
  
  textarea.focus();
}

// 필드 내용 지우기
function clearField(fieldId) {
  const fieldWrapper = document.querySelector(`[data-id="${fieldId}"]`);
  const textarea = fieldWrapper.querySelector('.text-field');
  textarea.value = '';
  updateStats(fieldWrapper);
  saveData(); // 즉시 저장
  textarea.focus();
}

// 필드 삭제 (5번 이상 문항만)
function removeField(fieldId) {
  if (fieldId <= 4) {
    alert('기본 문항(1-4)은 삭제할 수 없습니다.');
    return;
  }
  
  const fieldWrapper = document.querySelector(`[data-id="${fieldId}"]`);
  
  // 애니메이션과 함께 삭제
  fieldWrapper.style.transition = 'all 0.3s ease';
  fieldWrapper.style.opacity = '0';
  fieldWrapper.style.transform = 'translateX(-10px)';
  
  setTimeout(() => {
    fieldWrapper.remove();
    saveData(); // 삭제 후 저장
  }, 300);
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 문항 추가 버튼
  document.getElementById('addField').addEventListener('click', addField);
  
  // 전체 삭제 버튼
  document.getElementById('clearAll').addEventListener('click', clearAllFields);
  
  // 전체 글자수 복사 버튼
  document.getElementById('copyAllChars').addEventListener('click', copyAllChars);
  
  // 전체 바이트 복사 버튼
  document.getElementById('copyAllBytes').addEventListener('click', copyAllBytes);
  
  // 전체 텍스트 복사 버튼
  document.getElementById('copyAllText').addEventListener('click', copyAllText);
  
  // 기존 필드에 이벤트 리스너 추가
  document.querySelectorAll('.field-wrapper').forEach(fieldWrapper => {
    const textarea = fieldWrapper.querySelector('.text-field');
    
    // 입력 이벤트
    textarea.addEventListener('input', () => {
      updateStats(fieldWrapper);
      saveData(); // 입력할 때마다 저장
    });
    
    // 붙여넣기 이벤트 - 맨 위로 스크롤
    textarea.addEventListener('paste', () => {
      setTimeout(() => {
        textarea.scrollTop = 0;
        saveData(); // 붙여넣기 후 저장
      }, 10);
    });
    
    const fieldId = parseInt(fieldWrapper.getAttribute('data-id'));
    
    // 지우개 버튼
    const clearBtn = fieldWrapper.querySelector('.btn-clear');
    clearBtn.addEventListener('click', () => clearField(fieldId));
    
    // 텍스트 복사 버튼
    const copyFieldBtn = fieldWrapper.querySelector('.btn-copy-field');
    copyFieldBtn.addEventListener('click', () => copyFieldText(fieldId));
    
    // 공백포함 글자수 복사 버튼
    const copyCharsBtn = fieldWrapper.querySelector('.btn-copy-chars');
    copyCharsBtn.addEventListener('click', () => copyChars(fieldId));
    
    // 바이트 복사 버튼
    const copyBytesBtn = fieldWrapper.querySelector('.btn-copy-bytes');
    copyBytesBtn.addEventListener('click', () => copyBytes(fieldId));
  });
  
  // 데이터 복원 (localStorage 사용)
  loadData();
  
  // 데이터 자동 저장
  setInterval(saveData, 1000);
});

// 전체 삭제 (내용만 삭제, 문항은 유지)
function clearAllFields() {
  if (!confirm('모든 문항의 내용을 삭제하시겠습니까?')) {
    return;
  }
  
  const fieldsContainer = document.getElementById('fieldsContainer');
  const allFields = fieldsContainer.querySelectorAll('.field-wrapper');
  
  // 모든 필드의 텍스트만 초기화
  allFields.forEach(fieldWrapper => {
    const textarea = fieldWrapper.querySelector('.text-field');
    textarea.value = '';
    updateStats(fieldWrapper);
  });
  
  // 데이터 저장
  saveData();
}

// 전체 글자수 복사
function copyAllChars() {
  const fieldsContainer = document.getElementById('fieldsContainer');
  const allFields = fieldsContainer.querySelectorAll('.field-wrapper');
  
  let summary = '=== 자소서 글자수 요약 ===\n\n';
  
  allFields.forEach((fieldWrapper) => {
    const fieldNumber = fieldWrapper.querySelector('.field-number').textContent;
    const charsText = fieldWrapper.querySelector('.chars').textContent;
    
    summary += `${fieldNumber}: ${charsText}\n`;
  });
  
  // 클립보드에 복사
  navigator.clipboard.writeText(summary).then(() => {
    showCopyFeedback('copyAllChars', '✓ 복사 완료!');
  }).catch(err => {
    alert('복사에 실패했습니다.');
  });
}

// 전체 바이트 복사
function copyAllBytes() {
  const fieldsContainer = document.getElementById('fieldsContainer');
  const allFields = fieldsContainer.querySelectorAll('.field-wrapper');
  
  let summary = '=== 자소서 바이트 요약 ===\n\n';
  
  allFields.forEach((fieldWrapper) => {
    const fieldNumber = fieldWrapper.querySelector('.field-number').textContent;
    const bytesText = fieldWrapper.querySelector('.bytes').textContent;
    
    summary += `${fieldNumber}: ${bytesText}\n`;
  });
  
  // 클립보드에 복사
  navigator.clipboard.writeText(summary).then(() => {
    showCopyFeedback('copyAllBytes', '✓ 복사 완료!');
  }).catch(err => {
    alert('복사에 실패했습니다.');
  });
}

// 전체 텍스트 복사
function copyAllText() {
  const fieldsContainer = document.getElementById('fieldsContainer');
  const allFields = fieldsContainer.querySelectorAll('.field-wrapper');
  
  let allText = '';
  
  allFields.forEach((fieldWrapper, index) => {
    const fieldNumber = fieldWrapper.querySelector('.field-number').textContent;
    const content = fieldWrapper.querySelector('.text-field').value;
    
    if (content.trim()) {
      allText += `[${fieldNumber}]\n\n${content}\n\n`;
      if (index < allFields.length - 1) {
        allText += '---\n\n';
      }
    }
  });
  
  if (!allText.trim()) {
    alert('복사할 내용이 없습니다.');
    return;
  }
  
  // 클립보드에 복사
  navigator.clipboard.writeText(allText).then(() => {
    showCopyFeedback('copyAllText', '✓ 복사 완료!');
  }).catch(err => {
    alert('복사에 실패했습니다.');
  });
}

// 개별 문항 텍스트 복사
function copyFieldText(fieldId) {
  const fieldWrapper = document.querySelector(`[data-id="${fieldId}"]`);
  const fieldNumber = fieldWrapper.querySelector('.field-number').textContent;
  const content = fieldWrapper.querySelector('.text-field').value;
  
  if (!content.trim()) {
    alert('복사할 내용이 없습니다.');
    return;
  }
  
  const text = `[${fieldNumber}]\n\n${content}`;
  
  // 클립보드에 복사
  navigator.clipboard.writeText(text).then(() => {
    const btn = fieldWrapper.querySelector('.btn-copy-field');
    const originalText = btn.textContent;
    btn.textContent = '✓';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1000);
  }).catch(err => {
    alert('복사에 실패했습니다.');
  });
}

// 개별 문항 공백포함 글자수 복사
function copyChars(fieldId) {
  const fieldWrapper = document.querySelector(`[data-id="${fieldId}"]`);
  const charsText = fieldWrapper.querySelector('.chars').textContent;
  
  // 클립보드에 복사
  navigator.clipboard.writeText(charsText).then(() => {
    const btn = fieldWrapper.querySelector('.btn-copy-chars');
    const originalText = btn.textContent;
    btn.textContent = '✓';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1000);
  }).catch(err => {
    alert('복사에 실패했습니다.');
  });
}

// 개별 문항 바이트 복사
function copyBytes(fieldId) {
  const fieldWrapper = document.querySelector(`[data-id="${fieldId}"]`);
  const bytesText = fieldWrapper.querySelector('.bytes').textContent;
  
  // 클립보드에 복사
  navigator.clipboard.writeText(bytesText).then(() => {
    const btn = fieldWrapper.querySelector('.btn-copy-bytes');
    const originalText = btn.textContent;
    btn.textContent = '✓';
    
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1000);
  }).catch(err => {
    alert('복사에 실패했습니다.');
  });
}

// 복사 완료 피드백 표시
function showCopyFeedback(btnId, message) {
  const btn = document.getElementById(btnId);
  const originalText = btn.textContent;
  const originalBg = btn.style.background;
  const originalColor = btn.style.color;
  
  btn.textContent = message;
  
  if (btnId === 'copyStats') {
    btn.style.background = '#34c759';
    btn.style.color = 'white';
  } else if (btnId === 'copyAllText') {
    btn.style.background = '#007aff';
    btn.style.color = 'white';
  }
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = originalBg;
    btn.style.color = originalColor;
  }, 1500);
}

// 데이터 저장
function saveData() {
  const data = [];
  document.querySelectorAll('.field-wrapper').forEach(wrapper => {
    data.push({
      id: wrapper.getAttribute('data-id'),
      content: wrapper.querySelector('.text-field').value
    });
  });
  localStorage.setItem('jasoseoData', JSON.stringify(data));
}

// 데이터 불러오기
function loadData() {
  const savedData = localStorage.getItem('jasoseoData');
  if (!savedData) return;
  
  try {
    const data = JSON.parse(savedData);
    if (data.length === 0) return;
    
    const fieldsContainer = document.getElementById('fieldsContainer');
    fieldsContainer.innerHTML = '';
    
    data.forEach((item, index) => {
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'field-wrapper';
      fieldWrapper.setAttribute('data-id', item.id);
      
      // 5번 문항부터는 삭제 버튼 추가
      const removeButton = parseInt(item.id) > 4 ? 
        `<button class="btn-remove" data-field-id="${item.id}" title="문항 삭제">×</button>` : '';
      
      fieldWrapper.innerHTML = `
        <div class="field-header">
          <span class="field-number">문항 ${item.id}</span>
          <div class="field-actions">
            <button class="btn-copy-field" data-field-id="${item.id}" title="텍스트 복사">📄</button>
            <button class="btn-copy-chars" data-field-id="${item.id}" title="공백포함 글자수 복사">字</button>
            <button class="btn-copy-bytes" data-field-id="${item.id}" title="바이트 복사">B</button>
            <button class="btn-clear" data-field-id="${item.id}" title="내용 지우기">🗑️</button>
            ${removeButton}
          </div>
          <div class="field-stats">
            <span class="stat-value chars">0자</span>
            <span class="stat-divider">/</span>
            <span class="stat-value bytes">0B</span>
          </div>
        </div>
        <textarea class="text-field" placeholder="자기소개서 내용을 입력하세요...">${item.content}</textarea>
      `;
      
      fieldsContainer.appendChild(fieldWrapper);
      
      const textarea = fieldWrapper.querySelector('.text-field');
      textarea.addEventListener('input', () => {
        updateStats(fieldWrapper);
        saveData();
      });
      textarea.addEventListener('paste', () => {
        setTimeout(() => {
          textarea.scrollTop = 0;
          saveData();
        }, 10);
      });
      
      const fieldId = parseInt(item.id);
      fieldWrapper.querySelector('.btn-clear').addEventListener('click', () => clearField(fieldId));
      fieldWrapper.querySelector('.btn-copy-field').addEventListener('click', () => copyFieldText(fieldId));
      fieldWrapper.querySelector('.btn-copy-chars').addEventListener('click', () => copyChars(fieldId));
      fieldWrapper.querySelector('.btn-copy-bytes').addEventListener('click', () => copyBytes(fieldId));
      
      // 5번 이상 문항일 경우 삭제 버튼 이벤트 추가
      if (fieldId > 4) {
        fieldWrapper.querySelector('.btn-remove').addEventListener('click', () => removeField(fieldId));
      }
      
      updateStats(fieldWrapper);
    });
    
    fieldCount = Math.max(...data.map(item => parseInt(item.id)));
  } catch (e) {
    console.error('데이터 불러오기 실패:', e);
  }
}
