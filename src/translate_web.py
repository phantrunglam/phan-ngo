# -*- coding: utf-8 -*-
import os
import re
import json
from pathlib import Path
import shutil

# Cấu hình đường dẫn - phù hợp với cấu trúc ptl2
BASE_DIR = Path(__file__).parent.parent
DICT_FILE = BASE_DIR / "src" / "translation" / "en_vn_dictionary.json"  
TARGET_DIR = BASE_DIR / "public" / "vn"
LOG_FILE = BASE_DIR / "translation_log.txt"
BACKUP_DIR = BASE_DIR / "backup_translated_files"

def load_dictionary():
    """Tải từ điển và sắp xếp theo độ dài giảm dần"""
    with open(DICT_FILE, "r", encoding="utf-8") as f:
        dictionary = json.load(f)
    
    # Thêm các cụm từ đặc biệt cần xử lý trước
    special_cases = {
        r'/languages/en/': '/languages/vn/',
        r'src="/languages/en/': 'src="/languages/vn/',
        r'href="/languages/en/': 'href="/languages/vn/',
        r'../../languages/en/': '../../languages/vn/'
    }
    
    # Kết hợp từ điển và sắp xếp
    full_dict = {**special_cases, **dictionary}
    return dict(sorted(full_dict.items(), key=lambda x: -len(x[0])))

def backup_file(file_path):
    """Sao lưu file trước khi chỉnh sửa"""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    relative_path = file_path.relative_to(BASE_DIR / "public" / "vn")
    backup_path = BACKUP_DIR / relative_path
    
    os.makedirs(backup_path.parent, exist_ok=True)
    shutil.copy2(file_path, backup_path)
    return backup_path

# def translate_content(content, dictionary):
#     """Thực hiện dịch nội dung với từ điển"""
#     changes = []
#     for en, vi in dictionary.items():
#         try:
#             # Regex chính xác hơn, tránh thay thế trong thẻ HTML
#             pattern = re.compile(rf'(?<![\w\-/])({re.escape(en)})(?![\w\-/])', re.IGNORECASE)
#             new_content, count = pattern.subn(vi, content)
#             if count > 0:
#                 changes.append(f"{en} -> {vi} ({count} lần)")
#                 content = new_content
#         except Exception as e:
#             print(f"⚠️ Lỗi khi dịch '{en}': {e}")
#     return content, changes

def translate_content(content, dictionary):
    """Thực hiện dịch nội dung với từ điển (bỏ qua toàn bộ thẻ script và thuộc tính HTML)"""
    changes = []
    
    # Tách nội dung thành: thẻ script | thẻ HTML khác | text thông thường
    parts = re.split(r'(<script\b[^>]*>.*?</script>|<[^>]+>|href="[^"]+"|src="[^"]+")', content, flags=re.DOTALL)
    
    for i, part in enumerate(parts):
        # Chỉ dịch các phần không phải thẻ HTML và không phải thẻ script
        if not (part.startswith('<script') or 
                part.startswith('<') or 
                part.startswith('href="') or 
                part.startswith('src="')):
            
            for en, vi in dictionary.items():
                try:
                    # Regex chỉ dịch từ độc lập, không nằm trong từ phức
                    pattern = re.compile(rf'(?<!\w){re.escape(en)}(?!\w)', re.IGNORECASE)
                    new_part, count = pattern.subn(vi, part)
                    if count > 0:
                        changes.append(f"{en} -> {vi} ({count} lần)")
                        part = new_part
                except Exception as e:
                    print(f"⚠️ Lỗi khi dịch '{en}': {e}")
            parts[i] = part
    
    return ''.join(parts), changes


def process_html(file_path, dictionary):
    """Xử lý dịch một file HTML"""
    try:
        # Đọc nội dung file
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Sao lưu file gốc
        backup_path = backup_file(file_path)
        
        # Thực hiện dịch
        translated_content, changes = translate_content(content, dictionary)
        
        # Ghi đè file gốc
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(translated_content)
        
        # Ghi log
        if changes:
            with open(LOG_FILE, "a", encoding="utf-8") as log:
                log.write(f"📄 File: {file_path}\n")
                log.write(f"📝 Đã dịch {len(changes)} cụm từ:\n")
                log.write("\n".join(f"  - {c}" for c in changes))
                log.write("\n\n")
        
        print(f"✅ Đã dịch: {file_path} (backup: {backup_path})")
        return True
    
    except Exception as e:
        print(f"❌ Lỗi khi xử lý {file_path}: {str(e)}")
        return False

def process_all_files():
    """Xử lý toàn bộ thư mục"""
    print("⏳ Đang tải từ điển...")
    dictionary = load_dictionary()
    
    print(f"🔍 Đang quét file HTML trong: {TARGET_DIR}")
    
    total_files = 0
    success_files = 0
    
    # Xóa log cũ nếu tồn tại
    if LOG_FILE.exists():
        LOG_FILE.unlink()
    
    # Duyệt qua tất cả file HTML
    for file_path in TARGET_DIR.glob("**/*.html"):
        total_files += 1
        if process_html(file_path, dictionary):
            success_files += 1
    
    print(f"\n🎉 Kết quả:")
    print(f"- Tổng file: {total_files}")
    print(f"- Thành công: {success_files}")
    print(f"- Lỗi: {total_files - success_files}")
    print(f"\n📜 Log chi tiết: {LOG_FILE}")
    print(f"💾 Bản sao lưu: {BACKUP_DIR}")

if __name__ == "__main__":
    process_all_files()