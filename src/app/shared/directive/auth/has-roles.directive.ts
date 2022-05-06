import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *hasRoles="'ROLE_ADMIN'">...</some-element>
 *
 *     <some-element *hasRoles="['ROLE_ADMIN', 'ROLE_USER']">...</some-element>
 * ```
 */
@Directive({
  selector: '[hasRoles]',
})
export class HasRolesDirective {
  private authorities: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    public viewContainerRef: ViewContainerRef,
    protected authService: AuthService
  ) {}

  @Input() set hasRoles(value: string | string[]) {
    this.authorities = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
  }

  private updateView(): void {
    const hasAnyAuthority = this.authService.hasAnyAuthority(this.authorities);
    this.viewContainerRef.clear();
    if (hasAnyAuthority) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
