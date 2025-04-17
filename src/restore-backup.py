import shutil
from pathlib import Path

# Đường dẫn
BASE_DIR = Path(__file__).parent.parent
BACKUP_DIR = BASE_DIR / "backup_translated_files"
TARGET_DIR = BASE_DIR / "public" / "vn"

def restore_backup():
    print("🔄 Đang khôi phục từ backup...")
    shutil.copytree(BACKUP_DIR, TARGET_DIR, dirs_exist_ok=True)
    print(f"✅ Đã khôi phục {len(list(BACKUP_DIR.glob('**/*.html')))} file từ {BACKUP_DIR}")

if __name__ == "__main__":
    restore_backup()