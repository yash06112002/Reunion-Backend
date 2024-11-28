const Task = require('../models/Task');

exports.getTasksInfo = async (req, res) => {
    try {
        const tasks = await Task.find({});
        const pendingTasks = [], finishedTasks = [];

        tasks.forEach((task) => {
            if (task.status === 'Finished') {
                finishedTasks.push(task);
            }
            else {
                pendingTasks.push(task);
            }
        });
        const localDateAndTime = new Date(new Date().getTime() + 330 * 60 * 1000);

        const totalTasks = tasks.length;
        const tasksFinishedInPercent = ((finishedTasks.length * 100) / totalTasks).toFixed(1);
        const tasksPendingInPercent = ((pendingTasks.length * 100) / totalTasks).toFixed(1);
        const finishedTasksAverageTime = (finishedTasks.reduce((previousAverage, task, index) => {
            return (previousAverage * index + Number(task.endTime - task.startTime)) / (index + 1);
        }, 0) / (60 * 60 * 1000)).toFixed(1);
        const pendingTasksTimeLapsed = (pendingTasks
            .filter((task) => task.startTime <= localDateAndTime)
            .reduce((previousTotal, task) => {
                return previousTotal + Number(localDateAndTime - new Date(task.startTime));
            }, 0) / (60 * 60 * 1000)).toFixed(1);
        const estimatedTimeToFinishPendingTasks = (pendingTasks
            .filter((task) => task.startTime <= localDateAndTime)
            .reduce((previousTotal, task) => {
                return previousTotal + Number(new Date(task.endTime) - localDateAndTime);
            }, 0) / (60 * 60 * 1000)).toFixed(1);

        const priorityWisePendingTaskData = pendingTasks.reduce((previousData, task) => {
            previousData[task.priority - 1].count += 1;
            previousData[task.priority - 1].timeLapsed = (previousData[task.priority - 1].timeLapsed + Number(localDateAndTime - new Date(task.startTime)) / (60 * 60 * 1000)).toFixed(1);
            previousData[task.priority - 1].timeRemaining = (previousData[task.priority - 1].timeRemaining + Number(new Date(task.endTime) - localDateAndTime) / (60 * 60 * 1000)).toFixed(1);
        return previousData;
    }, new Array(5).fill(0).map(() => { return { count: 0, timeLapsed: 0, timeRemaining: 0 } }));
    res.status(200).json({
        totalTasks,
        tasksFinishedInPercent,
        tasksPendingInPercent,
        finishedTasksAverageTime,
        pendingTasksCount: pendingTasks.length,
        pendingTasksTimeLapsed,
        estimatedTimeToFinishPendingTasks,
        priorityWisePendingTaskData
    });
} catch (error) {
    res.status(500).json({ message: error.message });
}
};