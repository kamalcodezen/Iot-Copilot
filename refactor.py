import os

files_to_update = [
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\community\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\learning-path\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\settings\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\projects\[id]\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\projects\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\projects\[id]\edit\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\projects\new\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\interview-coach\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\explore\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\dashboard\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\admin\users\page.tsx',
    r'c:\Coding-Projects\projects\Iot-copilot\client\src\app\admin\page.tsx'
]

for filepath in files_to_update:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # community
    content = content.replace("import { communityService } from '@/services/community';", "import { getCommunityProjects, getCommunityProject, getComments } from '@/lib/api/community';\nimport { addCommentAction } from '@/lib/actions/community';")
    content = content.replace('communityService.getProjects', 'getCommunityProjects')
    content = content.replace('communityService.getProject', 'getCommunityProject')
    content = content.replace('communityService.getComments', 'getComments')
    content = content.replace('communityService.addComment', 'addCommentAction')
    
    # learningPath
    content = content.replace("import { learningPathService } from '@/services/learningPath';", "import { getLearningPaths, getLearningPath } from '@/lib/api/learningPath';\nimport { updateLearningPathAction, deleteLearningPathAction } from '@/lib/actions/learningPath';")
    content = content.replace('learningPathService.getAll', 'getLearningPaths')
    content = content.replace('learningPathService.getOne', 'getLearningPath')
    content = content.replace('learningPathService.update', 'updateLearningPathAction')
    content = content.replace('learningPathService.delete', 'deleteLearningPathAction')

    # ai
    content = content.replace("import { aiService } from '@/services/ai';", "import { getChatHistory, recommendNext } from '@/lib/api/ai';\nimport { aiChatAction, generateRoadmapAction, recommendComponentsAction, planProjectAction, aiDebugAction, getInterviewQuestionsAction, submitInterviewAnswerAction } from '@/lib/actions/ai';")
    content = content.replace('aiService.chat', 'aiChatAction')
    content = content.replace('aiService.getChatHistory', 'getChatHistory')
    content = content.replace('aiService.generateRoadmap', 'generateRoadmapAction')
    content = content.replace('aiService.recommendComponents', 'recommendComponentsAction')
    content = content.replace('aiService.planProject', 'planProjectAction')
    content = content.replace('aiService.debug', 'aiDebugAction')
    content = content.replace('aiService.interviewQuestions', 'getInterviewQuestionsAction')
    content = content.replace('aiService.submitInterviewAnswer', 'submitInterviewAnswerAction')
    content = content.replace('aiService.recommendNext', 'recommendNext')
    
    # user
    content = content.replace("import { userService } from '@/services/user';", "import { getProfile, getBadges } from '@/lib/api/user';\nimport { updateProfileAction, uploadAvatarAction } from '@/lib/actions/user';")
    content = content.replace('userService.getProfile', 'getProfile')
    content = content.replace('userService.updateProfile', 'updateProfileAction')
    content = content.replace('userService.uploadAvatar', 'uploadAvatarAction')
    content = content.replace('userService.getBadges', 'getBadges')

    # user / activities
    content = content.replace("import { activityService } from '@/services/user';", "import { getActivities, getActivityStats } from '@/lib/api/user';")
    content = content.replace('activityService.getAll', 'getActivities')
    content = content.replace('activityService.getStats', 'getActivityStats')
    
    # user / admin
    content = content.replace("import { adminService } from '@/services/user';", "import { getAdminUsers, getAdminStats } from '@/lib/api/user';\nimport { updateUserRoleAction, deleteUserAction } from '@/lib/actions/user';")
    content = content.replace('adminService.getUsers', 'getAdminUsers')
    content = content.replace('adminService.updateUserRole', 'updateUserRoleAction')
    content = content.replace('adminService.deleteUser', 'deleteUserAction')
    content = content.replace('adminService.getStats', 'getAdminStats')

    # project
    content = content.replace("import { projectService } from '@/services/project';", "import { getProjects, getProject } from '@/lib/api/project';\nimport { createProjectAction, updateProjectAction, deleteProjectAction, updateProjectProgressAction, toggleProjectLikeAction } from '@/lib/actions/project';")
    content = content.replace('projectService.getAll', 'getProjects')
    content = content.replace('projectService.getOne', 'getProject')
    content = content.replace('projectService.create', 'createProjectAction')
    content = content.replace('projectService.update', 'updateProjectAction')
    content = content.replace('projectService.delete', 'deleteProjectAction')
    content = content.replace('projectService.updateProgress', 'updateProjectProgressAction')
    content = content.replace('projectService.toggleLike', 'toggleProjectLikeAction')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
