package cron

import "time"

type CronTask struct {
	Interval int
	Func     func()
}

var cronTasks []CronTask

func AddCronTask(interval int, f func()) {
	cronTasks = append(cronTasks, CronTask{
		Interval: interval,
		Func:     f,
	})
}

func StartCron() {
	for _, task := range cronTasks {
		go func(t CronTask) {
			for {
				t.Func()
				time.Sleep(time.Duration(t.Interval) * time.Second)
			}
		}(task)
	}
}

func InitCron() {
	// AddCronTask(60*60*24, CleanTempCartTick)
	AddCronTask(60*60*24, RemoveUnusedFilesTick)
}
