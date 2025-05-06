/**
 * Typ reprezentujący kanał Discord na UI
 */
export interface ChannelOption {
  /** Identyfikator kanału */
  id: string;

  /** Nazwa kanału (bez symbolu #) */
  name: string;
}

/**
 * Typ reprezentujący rolę Discord na UI
 */
export interface RoleOption {
  /** Identyfikator roli */
  id: string;

  /** Nazwa roli */
  name: string;
}
