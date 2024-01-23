import type { TableColumnsType } from 'antd'
import { Table } from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Member } from '../../type'

type DataType = Member

interface SearchMemberTable {
  changeChecked: (values: Member[]) => void
}

const SearchMemberTable: React.FC<MemberTable> = (props) => {
  const { changeChecked } = props

  const selectedMemberContext = useContext(SelectedMemberContext)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Member[]>([])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const data: DataType[] = [
        {
          id: '1',
          name: 'John Brown'
        },
        {
          id: '2',
          name: 'Jim Green'
        },
        {
          id: '3',
          name: 'Joe Black'
        },
        {
          id: '4',
          name: 'Disabled User'
        }
      ]
      setDataSource(data)
      setLoading(false)
    }, 1000)
  }, [selectedMemberContext.selectedOrg])

  const columns: TableColumnsType<DataType> = [
    {
      title: '数据',
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>
    }
  ]
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      changeChecked(selectedRows as unknown as Member[])
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User',
      name: record.name
    })
  }

  let rowKeys = useMemo(() => {
    return selectedMemberContext.members.map((member: Member) => member.id)
  }, [selectedMemberContext.members])
  return (
    <Table
      loading={loading}
      rowKey={(row) => row.id}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: rowKeys,
        ...rowSelection
      }}
      size={'small'}
      columns={columns}
      dataSource={dataSource}
    />
  )
}

export default SearchMemberTable
