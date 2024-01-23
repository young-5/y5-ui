import { createContext } from 'react'
import { Member, Org } from './type'

interface SelectedMemberContext {
  members: Member[]
  clearSelect: () => void
  selectedOrgChange: (org: Org) => void
  checkedOrgsChange?: (orgs: Org[]) => void
  selectedOrg?: Org
  checkedOrgs?: Org[]
}

export const SelectedMemberContext = createContext<SelectedMemberContext>({
  members: [],
  clearSelect: () => {},
  selectedOrgChange: () => {},
  checkedOrgs: []
})