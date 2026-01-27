import zipfile
import os
import sys
import shutil

def unpack(pptx_path, output_dir):
    if not os.path.exists(pptx_path):
        print(f"Error: {pptx_path} not found")
        sys.exit(1)
    
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)

    with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
        zip_ref.extractall(output_dir)
    
    print(f"Unpacked {pptx_path} to {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python unpack.py <office_file> <output_directory>")
        sys.exit(1)
    unpack(sys.argv[1], sys.argv[2])
