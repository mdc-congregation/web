'use client'

export interface MemberApiRecord {
  id: string
  first_name: string
  last_name: string
  gender: string
  dob_month: string
  dob_day: string
  dob_year?: string | null
  phone: string
  address: string
  email?: string | null
  contact_person?: string | null
  city?: string | null
  country?: string | null
  family_id?: string | null
  occupation?: string | null
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null
  membership_status?: 'active' | 'inactive' | 'visitor' | null
  baptism_location?: string | null
  ministry?: string | null
  is_baptised?: boolean | null
  baptism_date?: string | null
  baptism_church?: string | null
  profile_photo?: string | null
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export interface MemberFormValues {
  firstName: string
  lastName: string
  gender: string
  dobMonth: string
  dobDay: string
  dobYear: string
  phone: string
  address: string
  email: string
  contactPerson: string
  city: string
  country: string
  familyId: string
  occupation: string
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  membershipStatus: 'active' | 'inactive' | 'visitor'
  baptismLocation: string
  ministry: string
  isBaptised: boolean
  baptismDate: string
  baptismChurch: string
  profilePhoto: string
  notes: string
}

export interface Member extends MemberFormValues {
  id: string
  name: string
  status: 'active' | 'inactive' | 'visitor'
  joinDate: string
  family?: string
  avatar?: string
  dateOfBirth?: string
}

export const emptyMemberFormValues = (): MemberFormValues => ({
  firstName: '',
  lastName: '',
  gender: '',
  dobMonth: '',
  dobDay: '',
  dobYear: '',
  phone: '',
  address: '',
  email: '',
  contactPerson: '',
  city: '',
  country: '',
  familyId: '',
  occupation: '',
  maritalStatus: 'single',
  membershipStatus: 'visitor',
  baptismLocation: '',
  ministry: '',
  isBaptised: false,
  baptismDate: '',
  baptismChurch: '',
  profilePhoto: '',
  notes: '',
})

export const normalizeMember = (member: MemberApiRecord): Member => {
  const firstName = member.first_name ?? ''
  const lastName = member.last_name ?? ''
  const dobParts = [member.dob_month, member.dob_day, member.dob_year].filter(Boolean)

  return {
    id: member.id,
    firstName,
    lastName,
    name: [firstName, lastName].filter(Boolean).join(' ').trim(),
    gender: member.gender ?? '',
    dobMonth: member.dob_month ?? '',
    dobDay: member.dob_day ?? '',
    dobYear: member.dob_year ?? '',
    dateOfBirth: dobParts.length > 0 ? dobParts.join(' ') : undefined,
    phone: member.phone ?? '',
    address: member.address ?? '',
    email: member.email ?? '',
    contactPerson: member.contact_person ?? '',
    city: member.city ?? '',
    country: member.country ?? '',
    familyId: member.family_id ?? '',
    family: member.family_id ?? undefined,
    occupation: member.occupation ?? '',
    maritalStatus: member.marital_status ?? 'single',
    membershipStatus: member.membership_status ?? 'visitor',
    status: member.membership_status ?? 'visitor',
    baptismLocation: member.baptism_location ?? '',
    ministry: member.ministry ?? '',
    isBaptised: Boolean(member.is_baptised),
    baptismDate: member.baptism_date ?? '',
    baptismChurch: member.baptism_church ?? '',
    profilePhoto: member.profile_photo ?? '',
    avatar: member.profile_photo ?? '/placeholder.svg',
    notes: member.notes ?? '',
    joinDate: member.created_at ?? '',
  }
}

export const serializeMemberForm = (form: MemberFormValues) => ({
  first_name: form.firstName.trim(),
  last_name: form.lastName.trim(),
  gender: form.gender,
  dob_month: form.dobMonth,
  dob_day: form.dobDay.trim(),
  dob_year: form.dobYear.trim() || null,
  phone: form.phone.trim(),
  address: form.address.trim(),
  email: form.email.trim() || null,
  contact_person: form.contactPerson.trim() || null,
  city: form.city.trim() || null,
  country: form.country.trim() || null,
  family_id: form.familyId.trim() || null,
  occupation: form.occupation.trim() || null,
  marital_status: form.maritalStatus,
  membership_status: form.membershipStatus,
  baptism_location: form.baptismLocation.trim() || null,
  ministry: form.ministry.trim() || null,
  is_baptised: form.isBaptised,
  baptism_date: form.isBaptised && form.baptismDate ? form.baptismDate : null,
  baptism_church: form.baptismChurch.trim() || null,
  profile_photo: form.profilePhoto || null,
  notes: form.notes.trim() || null,
})
