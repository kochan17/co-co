import zipfile
import os
import sys

def pack(input_dir, output_path):
    if not os.path.exists(input_dir):
        print(f"Error: {input_dir} not found")
        sys.exit(1)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zip_ref:
        for root, dirs, files in os.walk(input_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, input_dir)
                zip_ref.write(file_path, arcname)
    
    print(f"Packed {input_dir} into {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pack.py <input_directory> <office_file>")
        sys.exit(1)
    pack(sys.argv[1], sys.argv[2])
