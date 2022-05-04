import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';

@Directive({
  selector: '[appHasUserLevel]',
})
export class HasUserLevelDirective {
  private userLevel: string[] = [];
  constructor(
    private templateRef: TemplateRef<any>,
    public viewContainerRef: ViewContainerRef,
    protected authService: AuthService
  ) {}
  @Input() set hasUserLevel(value: string | string[]) {
    this.userLevel = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
  }
  private updateView(): void {
    const hasUserLevel = this.authService.hasUserLevelAccess(this.userLevel);
    this.viewContainerRef.clear();
    if (hasUserLevel) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
