import os
import re

def update_imports(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Fix component imports
                content = content.replace("@/components/dashboard", "@/features/dashboard/components")
                content = content.replace("@/components/projects", "@/features/projects/components")
                content = content.replace("@/components/ai", "@/features/ai/components")
                content = content.replace("@/components/landing", "@/features/landing/components")

                # Fix utils imports
                # In most files, they just do import { cn } from '@/lib/utils'
                # Let's replace simple instances
                content = re.sub(r"import \{([^}]+)\} from '@/lib/utils'", handle_utils_import, content)
                
                # Fix validations import
                content = content.replace("@/lib/validations", "@/utils/validation")

                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

def handle_utils_import(match):
    imports = [i.strip() for i in match.group(1).split(',')]
    cn_imports = []
    date_imports = []
    format_imports = []
    for i in imports:
        if i == 'cn':
            cn_imports.append(i)
        elif i == 'formatDate':
            date_imports.append(i)
        elif i in ['formatTime', 'getCategoryColor', 'getDifficultyColor', 'getStatusColor']:
            format_imports.append(i)
    
    result = []
    if cn_imports:
        result.append(f"import {{ {', '.join(cn_imports)} }} from '@/utils/cn';")
    if date_imports:
        result.append(f"import {{ {', '.join(date_imports)} }} from '@/utils/date';")
    if format_imports:
        result.append(f"import {{ {', '.join(format_imports)} }} from '@/utils/format';")
        
    return '\n'.join(result)

if __name__ == "__main__":
    update_imports("src")
