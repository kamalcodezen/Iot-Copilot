const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\community\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\learning-path\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\settings\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\[id]\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\[id]\\edit\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\new\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\interview-coach\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\explore\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\dashboard\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\admin\\users\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\admin\\page.tsx'
];

for (const filepath of filesToUpdate) {
    if (!fs.existsSync(filepath)) continue;
    let content = fs.readFileSync(filepath, 'utf8');
    
    // community
    content = content.replace("import { communityService } from '@/services/community';", "import { getCommunityProjects, getCommunityProject, getComments } from '@/lib/api/community';\nimport { addCommentAction } from '@/lib/actions/community';");
    content = content.replace(/communityService\.getProjects/g, 'getCommunityProjects');
    content = content.replace(/communityService\.getProject/g, 'getCommunityProject');
    content = content.replace(/communityService\.getComments/g, 'getComments');
    content = content.replace(/communityService\.addComment/g, 'addCommentAction');
    
    // learningPath
    content = content.replace("import { learningPathService } from '@/services/learningPath';", "import { getLearningPaths, getLearningPath } from '@/lib/api/learningPath';\nimport { updateLearningPathAction, deleteLearningPathAction } from '@/lib/actions/learningPath';");
    content = content.replace(/learningPathService\.getAll/g, 'getLearningPaths');
    content = content.replace(/learningPathService\.getOne/g, 'getLearningPath');
    content = content.replace(/learningPathService\.update/g, 'updateLearningPathAction');
    content = content.replace(/learningPathService\.delete/g, 'deleteLearningPathAction');

    // ai
    content = content.replace("import { aiService } from '@/services/ai';", "import { getChatHistory, recommendNext } from '@/lib/api/ai';\nimport { aiChatAction, generateRoadmapAction, recommendComponentsAction, planProjectAction, aiDebugAction, getInterviewQuestionsAction, submitInterviewAnswerAction } from '@/lib/actions/ai';");
    content = content.replace(/aiService\.chat/g, 'aiChatAction');
    content = content.replace(/aiService\.getChatHistory/g, 'getChatHistory');
    content = content.replace(/aiService\.generateRoadmap/g, 'generateRoadmapAction');
    content = content.replace(/aiService\.recommendComponents/g, 'recommendComponentsAction');
    content = content.replace(/aiService\.planProject/g, 'planProjectAction');
    content = content.replace(/aiService\.debug/g, 'aiDebugAction');
    content = content.replace(/aiService\.interviewQuestions/g, 'getInterviewQuestionsAction');
    content = content.replace(/aiService\.submitInterviewAnswer/g, 'submitInterviewAnswerAction');
    content = content.replace(/aiService\.recommendNext/g, 'recommendNext');
    
    // user
    content = content.replace("import { userService } from '@/services/user';", "import { getProfile, getBadges } from '@/lib/api/user';\nimport { updateProfileAction, uploadAvatarAction } from '@/lib/actions/user';");
    content = content.replace(/userService\.getProfile/g, 'getProfile');
    content = content.replace(/userService\.updateProfile/g, 'updateProfileAction');
    content = content.replace(/userService\.uploadAvatar/g, 'uploadAvatarAction');
    content = content.replace(/userService\.getBadges/g, 'getBadges');

    // user / activities
    content = content.replace("import { activityService } from '@/services/user';", "import { getActivities, getActivityStats } from '@/lib/api/user';");
    content = content.replace(/activityService\.getAll/g, 'getActivities');
    content = content.replace(/activityService\.getStats/g, 'getActivityStats');
    
    // user / admin
    content = content.replace("import { adminService } from '@/services/user';", "import { getAdminUsers, getAdminStats } from '@/lib/api/user';\nimport { updateUserRoleAction, deleteUserAction } from '@/lib/actions/user';");
    content = content.replace(/adminService\.getUsers/g, 'getAdminUsers');
    content = content.replace(/adminService\.updateUserRole/g, 'updateUserRoleAction');
    content = content.replace(/adminService\.deleteUser/g, 'deleteUserAction');
    content = content.replace(/adminService\.getStats/g, 'getAdminStats');

    // project
    content = content.replace("import { projectService } from '@/services/project';", "import { getProjects, getProject } from '@/lib/api/project';\nimport { createProjectAction, updateProjectAction, deleteProjectAction, updateProjectProgressAction, toggleProjectLikeAction } from '@/lib/actions/project';");
    content = content.replace(/projectService\.getAll/g, 'getProjects');
    content = content.replace(/projectService\.getOne/g, 'getProject');
    content = content.replace(/projectService\.create/g, 'createProjectAction');
    content = content.replace(/projectService\.update/g, 'updateProjectAction');
    content = content.replace(/projectService\.delete/g, 'deleteProjectAction');
    content = content.replace(/projectService\.updateProgress/g, 'updateProjectProgressAction');
    content = content.replace(/projectService\.toggleLike/g, 'toggleProjectLikeAction');

    fs.writeFileSync(filepath, content, 'utf8');
}
