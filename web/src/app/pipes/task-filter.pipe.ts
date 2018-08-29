import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task';

@Pipe({
    name: 'taskfilter',
    pure: false
})
export class TaskFilterPipe implements PipeTransform {
  transform(items: Task[], filter: Task): Task[] {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item: Task) => this.applyFilter(item, filter));
  }

  /**
   * Perform the filtering.
   *
   * @param {task} task The task to compare to the filter.
   * @param {task} filter The filter to apply.
   * @return {boolean} True if task satisfies filters, false if not.
   */
  applyFilter(task: Task, filter: Task): boolean {
    for (const field in filter) {
      if (filter[field] !== undefined && task[field] !== undefined) {
        if (typeof filter[field] === 'string') {
          if (task[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number' || typeof filter[field] === 'boolean') {
          if (task[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
