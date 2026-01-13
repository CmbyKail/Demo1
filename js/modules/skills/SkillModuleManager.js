// js/modules/skills/SkillModuleManager.js

/**
 * 技能模块管理器
 * 负责加载和管理所有技能模块的数据
 */
class SkillModuleManager {
  constructor() {
    this.modules = {};
    this.progress = this.loadProgress();
  }

  /**
   * 从服务器加载模块数据
   */
  async loadModules() {
    try {
      const response = await fetch('/server_data.json');
      const data = await response.json();
      this.modules = data.skillModules || {};
      return this.modules;
    } catch (error) {
      console.error('Failed to load skill modules:', error);
      return {};
    }
  }

  /**
   * 获取所有模块
   */
  getAllModules() {
    return Object.values(this.modules);
  }

  /**
   * 根据ID获取模块
   */
  getModule(moduleId) {
    return this.modules[moduleId];
  }

  /**
   * 获取指定课程
   */
  getLesson(moduleId, lessonId) {
    const module = this.getModule(moduleId);
    if (!module) return null;

    return module.theoryLessons.find(l => l.id === lessonId);
  }

  /**
   * 加载用户进度
   */
  loadProgress() {
    const saved = localStorage.getItem('skillProgress');
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * 保存用户进度
   */
  saveProgress() {
    localStorage.setItem('skillProgress', JSON.stringify(this.progress));
  }

  /**
   * 更新模块进度
   */
  updateModuleProgress(moduleId, data) {
    if (!this.progress[moduleId]) {
      this.progress[moduleId] = {
        completedLessons: [],
        exerciseScores: {},
        scenarioCount: 0,
        averageScore: 0,
        level: 1,
        xp: 0
      };
    }

    Object.assign(this.progress[moduleId], data);
    this.saveProgress();
    return this.progress[moduleId];
  }

  /**
   * 获取模块进度
   */
  getModuleProgress(moduleId) {
    return this.progress[moduleId] || null;
  }

  /**
   * 标记课程为已完成
   */
  completeLesson(moduleId, lessonId) {
    if (!this.progress[moduleId]) {
      this.updateModuleProgress(moduleId, {});
    }
    const progress = this.getModuleProgress(moduleId);
    if (progress && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.xp += 50; // 每节课50经验
      this.saveProgress();
    }
  }

  /**
   * 记录练习分数
   */
  recordExerciseScore(moduleId, exerciseId, score) {
    const progress = this.getModuleProgress(moduleId);
    if (progress) {
      progress.exerciseScores[exerciseId] = score;
      progress.xp += Math.floor(score / 2); // 分数转换为经验

      // 计算平均分
      const scores = Object.values(progress.exerciseScores);
      if (scores.length > 0) {
        progress.averageScore = Math.round(
          scores.reduce((a, b) => a + b, 0) / scores.length
        );
      }

      this.saveProgress();
    }
  }
}

// 导出单例
export const skillManager = new SkillModuleManager();
export { SkillModuleManager };
